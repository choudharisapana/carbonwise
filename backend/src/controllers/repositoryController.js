const Repository =
require('../models/Repository');

const Analysis =
require('../models/Analysis');

const githubService =
require('../services/githubService');

const getUserGithubToken =
require('../utils/getUserGithubToken');

const addRepository =
async(req,res)=>{

try{

    const { repositoryUrl } =
        req.body;

    const userToken =
        await getUserGithubToken(req.user.id);

    const repo =
        await githubService
        .fetchRepository(repositoryUrl, userToken);

    const newRepo =
        await Repository.create({

            user:req.user.id,

            repositoryUrl,

            repositoryName:repo.name,

            owner:repo.owner.login,

            description:repo.description,

            language:repo.language,

            stars:repo.stargazers_count,

            forks:repo.forks_count,

            size:repo.size,

            visibility:
                repo.private
                    ? "private"
                    : "public"
        });

    res.status(201).json({
        success:true,
        repository:newRepo
    });

}
catch(error){

    res.status(500).json({
        success:false,
        message:error.message
    });
}

};

// Get all repositories
const getRepositories = async (req, res) => {
    try {

        const repositories = await Repository.find({
            user: req.user.id
        }).sort({ createdAt: -1 }).lean();

        // The Repository model doesn't store sustainability/carbon data —
        // that lives on the Analysis model. Attach each repo's latest
        // analysis so the frontend stats (avgSustainability, avgCarbon,
        // analyzed count) reflect real numbers instead of always 0.
        const enrichedRepositories = await Promise.all(
            repositories.map(async (repo) => {
                const latestAnalysis = await Analysis.findOne({
                    repository: repo._id
                })
                .sort({ createdAt: -1 })
                .select('sustainabilityScore co2Emission createdAt');

                return {
                    ...repo,
                    sustainabilityScore: latestAnalysis?.sustainabilityScore ?? null,
                    carbonEmission: latestAnalysis?.co2Emission ?? null,
                    lastAnalyzed: latestAnalysis?.createdAt ?? null
                };
            })
        );

        res.json({
            success: true,
            repositories: enrichedRepositories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addRepository,
    getRepositories
};