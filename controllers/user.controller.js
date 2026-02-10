const User = require("../models/User.model");


const createUser = async (req, res) => {
    try {
        const { username, email } = req.body; 
        const newUser = new User({ username, email });      


        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    } 
};  


const getUsers = async(req,res)=>{
    try {
        
    

    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
}

module.exports = {createUser};
