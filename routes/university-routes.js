const express = require('express');
const {check} = require('express-validator');

const universityController = require('../controllers/university-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();


router.get('/get/:uid', universityController.getUniversityById);
router.get('/all',universityController.getAllUniversities);

router.post('/create',[
    check('state').not().isEmpty(),
    check('name').not().isEmpty(),
    check('city').not().isEmpty(),
],checkAuth,checkAdmin,universityController.createUniversity);

router.patch('/update/:uid', [
    check('state').not().isEmpty(),
    check('name').not().isEmpty(),
    check('city').not().isEmpty(),
],checkAuth, checkAdmin, universityController.updateUniversity);

router.delete('/delete/:uid',checkAuth, checkAdmin, universityController.deleteUniversity);

router.delete('/deleteAll',checkAuth, checkAdmin, universityController.deleteAllUniversities);


module.exports = router;