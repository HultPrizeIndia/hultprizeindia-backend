const express = require('express');
const {body} = require('express-validator');

const universityController = require('../controllers/university-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();


router.get('/get/:universityId', universityController.getUniversityById);
router.get('/all',universityController.getAllUniversities);

router.post('/create',[
    body('state').not().isEmpty(),
    body('name').not().isEmpty(),
    body('city').not().isEmpty(),
],checkAuth,checkAdmin,universityController.createUniversity);

router.patch('/update/:universityId', [
    body('state').not().isEmpty(),
    body('name').not().isEmpty(),
    body('city').not().isEmpty(),
],checkAuth, checkAdmin, universityController.updateUniversity);

router.delete('/delete/:universityId',checkAuth, checkAdmin, universityController.deleteUniversity);

router.delete('/deleteAll',checkAuth, checkAdmin, universityController.deleteAllUniversities);


module.exports = router;