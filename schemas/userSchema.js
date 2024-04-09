const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: String,
    image: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = userSchema;