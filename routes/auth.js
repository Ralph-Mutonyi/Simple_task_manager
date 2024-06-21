const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // import the User model

const router = express.Router(); // create a new router

router.post('/register', async (req, res) => {  // define the register route
    const { username, password } = req.body; // extract the username and password from the request body
    try {
        const existingUser = await User.findOne({ username }); // check if a user with the given username already exists
        if (existingUser) {
            return res.status (400).json({ message: 'User already exists' }); // if a user with the given username already exists, return an error response
        }

        const hashedPassword = await bcrypt.hash(password, 12); // hash the password
        const newUser = new User({ username, password: hashedPassword });  // create a new user
        await newUser.save(); // save the new user

        res.status(201).json({ message: 'User created' }); // return a success response
    }catch (error) {
        res.status(500).json({ message: 'Server error'}); // return an error response
    }
});

router.post('/login', async (req, res) => {
   const { username, password } = req.body; // extract the username and password from the request body
   try {
    const user = await User.findOne ({ username }); // find the user with the given username
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' }); // if the user does not exist, return an error response
    }
    const isMatch = await bcrypt.compare(password, user.password); // check if the password is correct
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' }); // if the password is incorrect, return an error response
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'}); // create a JWT token
    res.json({ token }); // return the token
   }catch (error) {
    res.status(500).json({ message: 'Server error'});
   }
});

module.exports = router; // export the router


