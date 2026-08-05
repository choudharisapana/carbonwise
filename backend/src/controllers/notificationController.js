const Notification =
require('../models/Notification');


// Get Notifications
const getNotifications =
async(req,res)=>{

    try{

        const notifications =
            await Notification
            .find({
                user:req.user.id
            })
            .sort({
                createdAt:-1
            });

        res.json({

            success:true,
            notifications
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


// Mark Read
const markAsRead =
async(req,res)=>{

    try{

        const notification =
            await Notification
            .findById(
                req.params.id
            );

        if(!notification){

            return res
            .status(404)
            .json({

                success:false,
                message:
                'Notification not found'
            });
        }

        notification.isRead =
            true;

        await notification.save();

        res.json({

            success:true,
            notification
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


// Mark All As Read
const markAllAsRead =
async(req,res)=>{

    try{

        await Notification
        .updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json({

            success:true,
            message: 'All notifications marked as read'
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


// Delete Notification
const deleteNotification =
async(req,res)=>{

    try{

        await Notification
        .findByIdAndDelete(
            req.params.id
        );

        res.json({

            success:true,
            message:
            'Notification deleted'
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

    getNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification
};