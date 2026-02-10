const mongoose = require("mongoose");

const UserSChnema = new mongoose.Schema({
    username:{
        type:String,

    },
    email:{
        type:String,
    },
    role:{
        type:String,
        enum:["viewer","creator"],
        default:"viewer",
    }

    
},{timestamps:true});

module.exports = mongoose.model("User",UserSChnema);