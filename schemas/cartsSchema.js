const mongoose = require("mongoose");


const cartsSchema = mongoose.Schema({
    productName : {
        type: String
    },
    category: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    productCode: {
        type: Number,
    },
    sellingDate: {
        type: Date,
    },
    title:{
        type: String
    },
    email:{
        type: String
    }
})


module.exports = cartsSchema;
