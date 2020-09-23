const express = require('express');
const {check} = require('express-validator');

const universityController = require('../controllers/university-controllers');
const checkAuth = require('../middleware/check-auth');

const router = new express.Router();


// router.get('/', universityController.getCampusDirectors);

module.exports = router;