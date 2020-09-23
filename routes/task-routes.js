const express = require('express');
const {check} = require('express-validator');

const taskController = require('../controllers/task-controllers');
const checkAuth = require('../middleware/check-auth');

const router = new express.Router();


// router.get('/', taskController.getCampusDirectors);

module.exports = router;