const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({ // define the schema for the task model
    task: {         // task will be used to store the task description
        type: String,
        required: true
    },
    userId: {       // userId will be used to associate the task with a user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
});

module.exports = mongoose.model('Task', TaskSchema);