const express = require('express');
const {check} = require('express-validator');

const taskController = require('../controllers/task-controllers');
const checkAuth = require('../middleware/check-auth');

const router = new express.Router();

router.get('/all',taskController.getAllTasks);
router.get('/:taskId', taskController.getTaskById);
router.get('/countStatus/:taskId', taskController.getTaskCountStatus);

// from this point token is required

router.use(checkAuth);

// here assignedBy is taken by userdata.
// here givenDate will be server gen.
// status is 0 by def.

//Todo: send mail to cd for incomplete task

router.post('/create', [
    // check that only admin id is allowed to CUD.
    check('deadline').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('priority').not().isEmpty(),
], taskController.createTask);

router.patch('/update/:taskId', taskController.updateTask);
router.delete('/delete/:taskId',taskController.deleteTaskById);
router.delete('/deleteAll', taskController.deleteTasks);

module.exports = router;