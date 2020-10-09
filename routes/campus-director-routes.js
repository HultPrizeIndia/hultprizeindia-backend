const express = require('express');
const {check} = require('express-validator');

const campusDirectorController = require('../controllers/campus-director-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();


router.get('/get/all', campusDirectorController.getCampusDirectors);

router.get('/forgotPassword/:email', campusDirectorController.forgotPassword);

router.post('/get/status', campusDirectorController.getCampusDirectorsByStatus);

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
], campusDirectorController.signUp);


router.post('/login', [
    check('email')
        .not()
        .isEmpty(),
    check('password').isLength({min: 6}),
], campusDirectorController.login);


router.patch('/changePassword',
    [
        check('newPassword').isLength({min: 6}),
        check('currentPassword').isLength({min: 6})
    ],
    checkAuth,
    campusDirectorController.changePassword);


router.post('/delete', checkAuth, checkAdmin, campusDirectorController.deleteCD);



// router.get('/:adminId', campusDirectorController.);
//
// router.post('/login', adminController.login);
// router.get('/forgotPassword/:email', adminController.forgotPassword);
// router.use(checkAuth);
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

// Update CD:               /api/v1/cd/update

// Change pass:             /api/v1/cd/changePass
// # Forget pass:           /api/v1/cd/forgetPass

module.exports = router;