const express = require('express');
const {body} = require('express-validator');

const campusDirectorController = require('../controllers/campus-director-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();


router.get('/get/all', campusDirectorController.getCampusDirectors);

router.get('/forgotPassword/:email', campusDirectorController.forgotPassword);

router.post('/get/status', [
    body('status')
        .not()
        .isEmpty(),
    body('taskId').not().isEmpty(),
], campusDirectorController.getCampusDirectorsByStatus);

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
], campusDirectorController.signUp);


router.post('/login', [
    body('email')
        .not()
        .isEmpty(),
    body('password').isLength({min: 6}),
], campusDirectorController.login);


router.patch('/changePassword',
    [
        body('newPassword').isLength({min: 6}),
        body('currentPassword').isLength({min: 6})
    ],
    checkAuth,
    campusDirectorController.changePassword);


router.post('/delete', [
    body('email').not().isEmpty
], checkAuth, checkAdmin, campusDirectorController.deleteCD);


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