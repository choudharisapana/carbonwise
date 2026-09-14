const Repository = require('../models/Repository');
const Analysis = require('../models/Analysis');

const githubService = require('../services/githubService');

const getUserGithubToken =
    require('../utils/getUserGithubToken');


// ==========================================
// ADD REPOSITORY
// POST /api/repositories
// ==========================================

const addRepository = async (req, res) => {

    try {

        const { repositoryUrl } = req.body;


        // ======================================
        // Validate Repository URL
        // ======================================

        if (!repositoryUrl) {

            return res.status(400).json({
                success: false,
                message: 'GitHub repository URL is required'
            });

        }


        const cleanUrl =
            repositoryUrl.trim();


        if (
            !cleanUrl.includes('github.com')
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Please enter a valid GitHub repository URL'
            });

        }


        // ======================================
        // Check Duplicate Repository
        // ======================================

        const existingRepository =
            await Repository.findOne({

                user: req.user.id,

                repositoryUrl: cleanUrl

            });


        if (existingRepository) {

            return res.status(409).json({

                success: false,

                message:
                    'This repository has already been added'

            });

        }


        // ======================================
        // Get User's GitHub Token
        // ======================================

        const userToken =
            await getUserGithubToken(
                req.user.id
            );


        // ======================================
        // Fetch Repository From GitHub
        // ======================================

        const repo =
            await githubService
                .fetchRepository(
                    cleanUrl,
                    userToken
                );


        if (!repo) {

            return res.status(404).json({

                success: false,

                message:
                    'Repository not found on GitHub'

            });

        }


        // ======================================
        // Save Repository
        // ======================================

        const newRepo =
            await Repository.create({

                user:
                    req.user.id,

                repositoryUrl:
                    cleanUrl,

                repositoryName:
                    repo.name,

                owner:
                    repo.owner?.login || '',

                description:
                    repo.description || '',

                language:
                    repo.language || 'Unknown',

                stars:
                    repo.stargazers_count || 0,

                forks:
                    repo.forks_count || 0,

                size:
                    repo.size || 0,

                visibility:
                    repo.private
                        ? 'private'
                        : 'public'

            });


        // ======================================
        // Success Response
        // ======================================

        res.status(201).json({

            success: true,

            message:
                'Repository added successfully',

            repository:
                newRepo

        });


    }
    catch (error) {

        console.error(
            'Add repository error:',
            error.message
        );


        res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:

                error.response?.data?.message ||

                error.message ||

                'Failed to add repository'

        });

    }

};


// ==========================================
// GET USER REPOSITORIES
// GET /api/repositories
// ==========================================

const getRepositories =
    async (req, res) => {

        try {

            // ==================================
            // Fetch User Repositories
            // ==================================

            const repositories =
                await Repository
                    .find({

                        user:
                            req.user.id

                    })
                    .sort({

                        createdAt:
                            -1

                    })
                    .lean();


            // ==================================
            // Attach Latest Analysis
            // ==================================

            const enrichedRepositories =
                await Promise.all(

                    repositories.map(
                        async (repo) => {


                            const latestAnalysis =
                                await Analysis
                                    .findOne({

                                        repository:
                                            repo._id

                                    })
                                    .sort({

                                        createdAt:
                                            -1

                                    })
                                    .select(

                                        `
                                        sustainabilityScore
                                        co2Emission
                                        energyConsumption
                                        grade
                                        createdAt
                                        `

                                    )
                                    .lean();


                            return {

                                ...repo,


                                // ==================
                                // Analysis Data
                                // ==================

                                sustainabilityScore:

                                    latestAnalysis
                                        ?.sustainabilityScore
                                    ?? null,


                                carbonEmission:

                                    latestAnalysis
                                        ?.co2Emission
                                    ?? null,


                                energyConsumption:

                                    latestAnalysis
                                        ?.energyConsumption
                                    ?? null,


                                grade:

                                    latestAnalysis
                                        ?.grade
                                    ?? null,


                                lastAnalyzed:

                                    latestAnalysis
                                        ?.createdAt
                                    ?? null

                            };

                        }

                    )

                );


            // ==================================
            // Success Response
            // ==================================

            res.status(200).json({

                success:
                    true,

                repositories:
                    enrichedRepositories

            });


        }
        catch (error) {

            console.error(
                'Get repositories error:',
                error.message
            );


            res.status(500).json({

                success:
                    false,

                message:
                    'Failed to fetch repositories'

            });

        }

    };


// ==========================================
// EXPORT CONTROLLER
// ==========================================

module.exports = {

    addRepository,

    getRepositories

};