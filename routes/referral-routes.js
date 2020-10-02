const express = require('express');
const {check} = require('express-validator');

const referralController = require('../controllers/referral-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', referralController.getAllReferrals);
router.get('/get/:referralId', referralController.getReferralById);

router.post('/create', [
    check('description').not().isEmpty(),
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('mobile').not().isEmpty()
], checkAuth, referralController.createReferral);

router.patch('/update/:referralId', [
    check('description').not().isEmpty(),
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('mobile').not().isEmpty()
], checkAuth, referralController.updateReferral);

router.delete('/delete/:referralId', checkAuth, checkAdmin, referralController.deleteReferral);

router.delete('/deleteAll', checkAuth, checkAdmin, referralController.deleteAllReferrals);

module.exports = router;