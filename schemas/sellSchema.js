const mongoose = require('mongoose');

const sellSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Quantity must be a non-negative number'
        }
    },
    price: {
        type: Number,
        required: true,
    },
    sellingDate: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    productCode: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required : false
    },
    email: {
        type: String,
        required: true,
    }
})

module.exports = sellSchema;