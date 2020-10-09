const express = require('express');
const {check} = require('express-validator');

const adminController = require('../controllers/admin-controller');
const checkAuth = require('../middleware/check-auth');


const router = new express.Router();

router.get('/', adminController.getAdmins);

router.get('/:adminId', adminController.getAdminById);

router.get('/forgotPassword/:email', adminController.forgotPassword);


router.post('/signup', [
    check('firstName')
        .not()
        .isEmpty(),
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('university').not().isEmpty(),
    check('password').isLength({min: 6}),
    check('mobile').not().isEmpty(),
], adminController.signUp);

router.post('/login', [
    check('email')
        .not()
        .isEmpty(),
    check('password').isLength({min: 6}),

], adminController.login);


router.patch('/changePassword',
    [
        check('newPassword').isLength({min: 6}),
        check('currentPassword').isLength({min: 6})
    ],
    checkAuth,
    adminController.changePassword);

module.exports = router;