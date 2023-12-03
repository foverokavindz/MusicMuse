const mongoose = require('mongoose');
const { Product } = require('../models/product');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: { type: String, required: true },
      quantity: { type: String, required: true, default: 1 },
      price: { type: String, required: true },
      total: { type: String, required: true },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

// item-wise total
cartSchema.methods.updateItemTotal = function () {
  let total = 0;
  this.product.forEach((item) => {
    item.total = parseFloat(item.quantity) * parseFloat(item.price);
  });
  this.total = total;
};

cartSchema.methods.updateAllTotal = function () {
  let total = 0;
  this.product.forEach((item) => {
    total += parseFloat(item.total);
  });
  this.total = total;
};

const Cart = mongoose.model('Cart', cartSchema);

// Need validation method

module.exports = Cart;

// Cart -> (customer, Items{ProductID, name, uty, price}, total)
