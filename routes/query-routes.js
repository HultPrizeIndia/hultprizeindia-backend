const express = require('express');
const { check } = require('express-validator');

const queryController = require('../controllers/query-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', queryController.getAllReferrals);
router.get('/get/:referralId', queryController.getReferralById);

router.post('/create', [
    check('description').not().isEmpty(),
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('mobile').not().isEmpty()
], checkAuth, queryController.createReferral);

router.patch('/update/:referralId', [
    check('description').not().isEmpty(),
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('mobile').not().isEmpty()
], checkAuth, queryController.updateReferral);

router.delete('/delete/:referralId', checkAuth, checkAdmin, queryController.deleteReferral);

// Very dangerous route. Why is it even implemented?
router.delete('/deleteAll', checkAuth, checkAdmin, queryController.deleteAllReferrals);

module.exports = router;