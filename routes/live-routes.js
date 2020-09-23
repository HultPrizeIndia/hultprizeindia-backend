const express = require('express');
const {check} = require('express-validator');

const liveController = require('../controllers/live-controllers');
const checkAuth = require('../middleware/check-auth');

const router = new express.Router();


// router.get('/', liveController.getCampusDirectors);

module.exports = router;