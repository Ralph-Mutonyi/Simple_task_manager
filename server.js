require('dotenv').config(); // import the dotenv package

const express = require('express'); // import the express package
const mongoose = require('mongoose'); // import the mongoose package
const bodyParser = require('body-parser'); // import the body-parser package
const cors = require('cors'); // import the cors package
const path = require('path'); // import the path package

const authRoutes = require('./routes/auth'); // import the auth routes
const taskRoutes = require('./routes/tasks'); // import the task routes

const app = express(); // create a new express app

app.use(cors()); // use the cors middleware
app.use(bodyParser.json()); // use the body-parser middleware
app.use(express.static(path.join(__dirname, 'client')));

app.use('/api/auth', authRoutes); // use the auth routes
app.use('/api', taskRoutes); // use the task routes

const PORT = process.env.PORT || 3000; // set the port

// connect to the database
mongoose.connect(process.env.MONGODB_URI, {
    userNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(error => {
   console.error('Error connecting to MongoDB: ', error);
});

