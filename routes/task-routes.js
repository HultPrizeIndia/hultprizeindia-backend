const express = require('express');
const {check} = require('express-validator');

const taskController = require('../controllers/task-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = new express.Router();

router.get('/all', taskController.getAllTasks);
router.get('/:taskId', taskController.getTaskById);
router.get('/countStatus/:taskId', taskController.getTaskCountStatus);

// from this point token is required
//
router.use(checkAuth);

// check that only admin id is allowed to CUD.

router.use(checkAdmin);

// here assignedBy is taken by userdata.
// here givenDate will be server gen.
// status is 0 by def.

router.post('/create', [
    check('deadline').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('priority').not().isEmpty(),
], taskController.createTask);

router.patch('/update/:taskId', [
    check('status').not().isEmpty(),
    check('deadline').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('priority').not().isEmpty(),
], taskController.updateTask);

router.delete('/delete/:taskId', taskController.deleteTaskById);

router.delete('/deleteAll', taskController.deleteTasks);

//Todo: send mail to cd for incomplete task
module.exports = router;