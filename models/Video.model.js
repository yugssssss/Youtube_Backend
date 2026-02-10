const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    dricription:{
        type:String,
    },
    channelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel",
    }
    
},{
    timestamps:true,
})

module.exports = mongoose.model("Video",VideoSchema);
    