const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;  // SECRET KEY

// Register a new user
authRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    }catch (error) {
        res.status(500).json({ message: 'Error creating user', error});
    }
});

// Login a user
authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });   
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }catch (error) {
        res.status(500).json({ message: 'Error loggin in', error});
    }
});

module.exports = authRouter;