const express = require('express');
const {check} = require('express-validator');

const campusDirectorController = require('../controllers/campus-director-controllers');
const checkAuth = require('../middleware/check-auth');

const router = new express.Router();


router.get('/', campusDirectorController.getCampusDirectors);

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

module.exports = router;