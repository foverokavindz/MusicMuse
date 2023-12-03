const mongoose = require('mongoose');
const Joi = require('joi');
// const Category = require('./category');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // required: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  review: [
    new mongoose.Schema({
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    }),
  ],
  numReviews: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    price: Joi.number().min(0).required(),
    category: Joi.array().items(
      Joi.object({
        _id: Joi.string().required(),
      })
    ),
    stock: Joi.number(),
  });

  return schema.validate(product);
}

module.exports = {
  validate: validateProduct,
  Product: Product,
};
