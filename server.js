const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// configure dotenv to use the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // LISTEN ON THIS PORT

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection   
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define Task Schema and model
const taskSchema = new mongoose.Schema({
    text: { 
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true
    },
});

const Task = mongoose.model('Task', taskSchema);

// The Routes
// the get route

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// the post route
app.post('/api/tasks', async (req, res) => {
    const { text, userId } = req.body;
    if(!text || !userId) {
        return res.status(400).json({ message: 'Text and userId are required' });
    }
    try{
        const newTask = new Task({ text, userId });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error){
        res.status(500).json({ message: 'Error creating task' });
    }
});

// the put route
app.put('/api/tasks/: id', async (req, res) => {
    const { text, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                text, 
                completed
            },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    }catch (error) {
        res.status(500).json({
            message: 'Error updating task'
        });
    }
})
// the delete route


// start listening to the server on its PORT
app.listen(PORT, () => {
    console.log('Sever is running on http://localhost:${PORT}');
});