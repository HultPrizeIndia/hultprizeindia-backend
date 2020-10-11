const express = require('express');
const { body } = require('express-validator');

const queryController = require('../controllers/query-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', queryController.getAllQuery);
router.get('/get/:queryId', queryController.getQueryyId);

router.post('/create', [
    body('description').not().isEmpty(),
    body('title').not().isEmpty()
], checkAuth, queryController.createQuery);

router.patch('/update/:queryId', [
    body('description').not().isEmpty(),
    body('title').not().isEmpty()
], checkAuth, queryController.updateQuery);

router.delete('/delete/:queryId', checkAuth, queryController.deleteQuery);

// Very dangerous route. Why is it even implemented?
router.delete('/deleteAll', checkAuth, checkAdmin, queryController.deleteAllQueries);

module.exports = router;