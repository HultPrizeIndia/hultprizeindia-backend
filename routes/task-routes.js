const express = require('express');
const {check} = require('express-validator');

const taskController = require('../controllers/task-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/all', taskController.getAllTasks);
router.get('/get/:taskId', taskController.getTaskById);
router.get('/countStatus/:taskId', taskController.getTaskCountStatus);

// here assignedBy is taken by userdata.
// here givenDate will be server gen.
// status is 0 by def.

router.post('/create', [
    check('deadline').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('priority').not().isEmpty(),
],checkAuth, checkAdmin, taskController.createTask);

router.patch('/update/:taskId', [
    check('status').not().isEmpty(),
    check('deadline').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('priority').not().isEmpty(),
],checkAuth, checkAdmin, taskController.updateTask);

router.delete('/delete/:taskId',checkAuth, checkAdmin, taskController.deleteTaskById);

router.delete('/deleteAll',checkAuth, checkAdmin, taskController.deleteTasks);

//Todo: send mail to cd for incomplete task
module.exports = router;