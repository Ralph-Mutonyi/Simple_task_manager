const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const Task = require('./models/task');
const dotenv = require('dotenv');

// configure dotenv to use the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // LISTEN ON THIS PORT
const JWT_SECRET = process.env.JWT_SECRET; // SECRET KEY

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


// middleware to verify JWT
const autheticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token)return res.status(401).json({ message: 'Access denied' });

    try{
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    }catch(err) {
        res.status(400).json({ message: 'Invalid token' });   
    }
};

app.use('/api', authRouter);

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

app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// the post route
app.post('/api/tasks', autheticateToken, async (req, res) => {
    const { text } = req.body;
    if(!text) {
        return res.status(400).json({ message: 'Text is required' });
    }
    try{
        const newTask = new Task({ text, userId: req.user.userId });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error){
        res.status(500).json({ message: 'Error creating task' });
    }
});

// the put route
app.put('/api/tasks/: id', autheticateToken, async (req, res) => {
    const { text, completed } = req.body;
    try {
        const updatedTask = await Task.findOneAndDelete(
            { _id: req.params.id, userId: req.user.id },
            { text, completed },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    }catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
})
// the delete route
app.delete('/api/tasks/:id', autheticateToken, async (req, res) =>{
    try{
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if(!deletedTask){
            return res.status(404).json({ message: 'Task not found' });   
        }
        res.status(204).end();
    }catch (error){
        res.status(500).json({ message: 'Error deleting task' });
    }
});

// start listening to the server on its PORT
app.listen(PORT, () => {
    console.log('Sever is running on http://localhost:${PORT}');
});