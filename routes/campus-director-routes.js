const {Router} = require('express');
const {check} = require('express-validator');

const campusDirectorController = require('../controllers/campus-director-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = new Router();


router.get('/', campusDirectorController.getCampusDirectors);

// router.get('/:adminId', campusDirectorController.);
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