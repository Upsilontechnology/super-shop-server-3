const mongoose = require('mongoose');

const noteBookSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    date: { type: Date, default: Date.now }
})

module.exports = noteBookSchema;