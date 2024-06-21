const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  // define the schema for the user model
    username: {             // username will be used as a unique identifier
        type: String,
        required: true,
        unique: true
    },
    password: {             // password will be stored as a hash
        type: String,
        required: true
    }
});

model.exports = mongoose.model('User', UserSchema);  // create the model for users and expose it to our app