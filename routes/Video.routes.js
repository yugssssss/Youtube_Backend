const express = require('express');

const router  = express.Router();
const pubishvideo = require('../controllers/video.controller');
router.post('/publishVideo',pubishvideo);

module.exports = router;    