const express = require('express');
const {body} = require('express-validator');

const taskController = require('../controllers/task-controller');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/get/all', taskController.getAllTasks);
router.get('/get/:taskId', taskController.getTaskById);
router.get('/get/admin/:adminId', taskController.getTasksByAdminId);

// here assignedBy is taken by userdata.
// here givenDate will be server gen.
// status is 0 by def.

router.post('/create/one/:campusDirectorId', [
    body('deadline').not().isEmpty(),
    body('name').not().isEmpty(),
    body('description').not().isEmpty(),
    body('priority').not().isEmpty(),
], checkAuth, checkAdmin, taskController.createTaskForOne);

router.post('/create/all', [
    body('deadline').not().isEmpty(),
    body('name').not().isEmpty(),
    body('description').not().isEmpty(),
    body('priority').not().isEmpty(),
], checkAuth, checkAdmin, taskController.createTaskForAll);

router.patch('/update/:taskId', [
    body('deadline').not().isEmpty(),
    body('name').not().isEmpty(),
    body('description').not().isEmpty(),
    body('priority').not().isEmpty(),
], checkAuth, checkAdmin, taskController.updateTask);

router.delete('/delete/:taskId', checkAuth, checkAdmin, taskController.deleteTaskById);

router.delete('/deleteAll', checkAuth, checkAdmin, taskController.deleteTasks);

//Todo: send mail to cd for incomplete task
module.exports = router;