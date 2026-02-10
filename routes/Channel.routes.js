const express = require('express');
const { createChannel, getAccountDetails, getDetails } = require('../controllers/channel.controller');
const router = express.Router();



// Define channel-related routes here
router.post("/create-channel", createChannel);
router.get('/get-account-details', getAccountDetails);
router.get('/getAllDetails/:userId', getDetails);
module.exports = router;    
