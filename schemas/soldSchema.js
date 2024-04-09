const { default: mongoose } = require("mongoose");


const soldSchema = mongoose.Schema({
    productName: {
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
    title: {
        type: String
    }
})


module.exports = soldSchema;
