const express = require('express');
const {body} = require('express-validator');

const adminController = require('../controllers/admin-controller');
const checkAuth = require('../middleware/check-auth');


const router = new express.Router();

router.get('/get/all', adminController.getAdmins);

router.get('/get/:adminId', adminController.getAdminById);

router.post('/forgotPassword', [
    body('email').not().isEmpty()
], adminController.forgotPassword);


router.post('/signup', [
    body('firstName')
        .not()
        .isEmpty(),
    body('email')
        .normalizeEmail()
        .isEmail(),
    body('university').not().isEmpty(),
    body('password').isLength({min: 6}),
    body('mobile').not().isEmpty(),
], adminController.signUp);

router.post('/login', [
    body('email')
        .not()
        .isEmpty(),
    body('password').isLength({min: 6}),

], adminController.login);


router.patch('/changePassword',
    [
        body('newPassword').isLength({min: 6}),
        body('currentPassword').isLength({min: 6})
    ],
    checkAuth,
    adminController.changePassword);

module.exports = router;