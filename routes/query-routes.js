const express = require('express');
const { check } = require('express-validator');

const queryController = require('../controllers/query-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', queryController.getAllQuery);
router.get('/get/:queryId', queryController.getQueryyId);

router.post('/create', [
    check('description').not().isEmpty(),
    check('title').not().isEmpty()
], checkAuth, queryController.createQuery);

// I think Title and Desc shouldnt be required,
// cus then the user will HAVE to change them?
router.patch('/update/:queryId', [
    check('description').not().isEmpty(),
    check('title').not().isEmpty()
], checkAuth, queryController.updateQuery);

router.delete('/delete/:queryId', checkAuth, queryController.deleteQuery);

// Very dangerous route. Why is it even implemented?
router.delete('/deleteAll', checkAuth, checkAdmin, queryController.deleteAllQueries);

module.exports = router;