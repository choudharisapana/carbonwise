const User =
require('../models/User');


// Get Settings
const getSettings =
async(req,res)=>{

    try{

        const user =
            await User
            .findById(
                req.user.id
            )
            .select(
                'preferences'
            );

        res.json({

            success:true,

            preferences:
                user.preferences
        });

    }
    catch(error){

        res.status(500)
        .json({

            success:false,

            message:
                error.message
        });
    }
};


// Update Settings
const updateSettings =
async(req,res)=>{

    try{

        const user =
            await User
            .findById(
                req.user.id
            );

        user.preferences = {

            ...user.preferences,

            ...req.body
        };

        await user.save();

        res.json({

            success:true,

            preferences:
                user.preferences
        });

    }
    catch(error){

        res.status(500)
        .json({

            success:false,

            message:
                error.message
        });
    }
};

module.exports = {

    getSettings,

    updateSettings
};