const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(2).max(1024).required(),
    //productId: Joi.array().items(Joi.objectId()),
  });

  return schema.validate(category);
}

module.exports = {
  validate: validateCategory,
  Category: Category,
};
