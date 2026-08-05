const Analysis =
require('../models/Analysis');

const getAnalytics =
async(req,res)=>{

    try{

        const analyses =
            await Analysis.find({
                user:req.user.id
            });

        const monthlyTrend =
            analyses.map(a=>({

                month:
                    a.createdAt
                    .toLocaleString(
                        'default',
                        {
                            month:'short'
                        }
                    ),

                sustainability:
                    a.sustainabilityScore,

                carbon:
                    a.co2Emission
            }));

        const sustainabilityAverage =
            analyses.length
            ?
            Math.round(

                analyses.reduce(
                    (sum,a)=>
                        sum+
                        a.sustainabilityScore,
                    0
                )
                /
                analyses.length

            )
            :
            0;

        const carbonAverage =
            analyses.length
            ?
            Math.round(

                analyses.reduce(
                    (sum,a)=>
                        sum+
                        a.co2Emission,
                    0
                )
                /
                analyses.length

            )
            :
            0;

        res.json({

            success:true,

            analytics:{

                totalAnalysis:
                    analyses.length,

                sustainabilityAverage,

                carbonAverage,

                monthlyTrend
            }
        });

    }
    catch(error){

        res.status(500)
        .json({

            success:false,

            message:error.message
        });
    }
};

module.exports = {
    getAnalytics
};