const express = require('express');
const {body} = require('express-validator');

const referralController = require('../controllers/referral-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', referralController.getAllReferrals);
router.get('/get/:referralId', referralController.getReferralById);

router.post('/create', [
    body('description').not().isEmpty(),
    body('name').not().isEmpty(),
    body('email').not().isEmpty(),
    body('mobile').not().isEmpty()
], checkAuth, referralController.createReferral);

router.patch('/update/:referralId', [
    body('description').not().isEmpty(),
    body('name').not().isEmpty(),
    body('email').not().isEmpty(),
    body('mobile').not().isEmpty()
], checkAuth, referralController.updateReferral);

router.delete('/delete/:referralId', checkAuth, checkAdmin, referralController.deleteReferral);

// Very dangerous route. Why is it even implemented?
router.delete('/deleteAll', checkAuth, checkAdmin, referralController.deleteAllReferrals);

module.exports = router;