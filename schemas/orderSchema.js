const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  advancedAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
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
