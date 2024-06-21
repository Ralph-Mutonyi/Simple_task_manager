const express = require('express');
const Task = require('../models/task'); // import the Task model
const auth = require('../middleware/auth'); // import the auth middleware

const router = express.Router(); // create a new router

router.get('/tasks', auth, async (req, res) => {        // define the get tasks route
    try {
        const tasks = await Task.find({ userId: req.user.id }); // find all tasks with the user ID from the request
        res.json(tasks); // return the tasks
    } catch(error) {
        res.status(500).json({ message: 'Server error'}); // return an error response
    }
});

router.post('/tasks', auth, async (req, res) => {            // define the create task route
    const { task } = req.body; // extract the task from the request body
    try {
        const newTask = new Task({ task, userId: req.user.id }); // create a new task
        await newTask.save(); // save the new task
        res.status(201).json(newTask); // return the new task
    }catch (error) {
        res.status(500).json({ message: 'Server error'}); // return an error response
    }
});

router.delete('/tasks/:id', auth, async (req, res) => { // define the delete task route
    try {
        await Task.findByIdAndDelete(req.params.id); // find and delete the task with the given ID
        res.json({ message: 'Task deleted' }); // return a success response
    }catch (error) {
        res.status(500).json({ message: 'Server error'}); // return an error response
    }
});

module.exports = router; // export the router