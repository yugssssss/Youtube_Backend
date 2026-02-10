const express = require('express');
const { createUser } = require('../controllers/user.controller');

const router = express.Router();



// Define user-related routes here
router.post("/create-user", createUser);

module.exports = router;    
