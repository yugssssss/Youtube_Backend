const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    ChannelName:{
        type:String,
    },
    about:{
        type:String,
    },
    ownerId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

})

module.exports = mongoose.model("Channel",ChannelSchema);