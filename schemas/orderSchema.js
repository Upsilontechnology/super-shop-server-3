const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  productStatus: {
    type: String,
  },
});
const orderSchema = mongoose.Schema({
  products: [productsSchema],
  deliveryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value && value > Date.now();
      },
      message: "Delivery date must be in the future",
    },
  },
  orderedDate: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  invoiceNo: {
    type: String,
    required: false,
    unique: true,
  },
  advancedAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/,
  },
});

module.exports = orderSchema;
