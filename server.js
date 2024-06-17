const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // LISTEN ON THIS PORT

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

// Define the data file path
const dataFilePath = path.join(__dirname, 'data', 'tasks.json');

// Read tasks from the data file
const readTasks = () => {
    if(!fs.existsSync(dataFilePath)){
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// write tasks to the data File
const writeTasks = (tasks) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
};

// the routes
// the get route
app.get('/api/taks', (req, res) =>{
    const tasks = readTasks();
    res.json(tasks);
});

// the post route
app.post('/api/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        text: req.body.text
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// the put route
app.put('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
    if(taskIndex > -1){
        tasks[taskIndex].text = req.body.text;
        writeTasks(tasks);
        res.json(tasks[taskIndex]);
    }else{
        res.status(404).json({ message: 'Task not Found'});
    }
});

// the delete route
app.delete('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const newTasks = tasks.filter(task => task => task.id !== parseInt(req.params.id));
    writeTasks(newTasks);
    res.status(204).end();
});

// start listening to the server on its PORT
app.listen(PORT, () => {
    console.log('Sever is running on http://localhost:${PORT}');
});