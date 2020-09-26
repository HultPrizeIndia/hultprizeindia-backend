const express = require('express');
const {check} = require('express-validator');

const adminController = require('../controllers/admin-controllers');
const checkAuth = require('../middleware/check-auth');


const router = new express.Router();

router.get('/', adminController.getAdmins);

router.get('/:adminId', adminController.getAdminById);

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




//
// router.post(
//     '/signup',
//     fileUpload.single('image'),
//     [
//         check('username')
//             .not()
//             .isEmpty(),
//         check('email')
//             .normalizeEmail()
//             .isEmail(),
//         check('mobile').not().isEmpty(),
//         check('password').isLength({min: 6})
//     ],
//     adminController.signup
// );
//
// router.post('/login', adminController.login);
// router.get('/forgotPassword/:email', adminController.forgotPassword);
// // router.use(checkAuth); DO NOT USE THIS.
// router.patch('/changePassword', [check('newPassword').isLength({min: 6})], adminController.changePassword);
// router.patch('/edit', fileUpload.single('image'),
//     [
//         check('username')
//             .not()
//             .isEmpty(),
//         check('email')
//             .normalizeEmail()
//             .isEmail(),
//         check('mobile').not().isEmpty()
//     ], adminController.editUser);

module.exports = router;