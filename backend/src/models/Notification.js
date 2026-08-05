const mongoose = require('mongoose');

const notificationSchema =
new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    title:String,

    message:String,

    type:{
        type:String,
        enum:[
            'analysis',
            'report',
            'system'
        ]
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    'Notification',
    notificationSchema
);