const asyncHandler = require('express-async-handler');
const { Category, validate } = require('../models/category');
const { Product } = require('../models/product');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.send(categories);
});

const addnewCategory = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = await new Category({
    name: req.body.name,
    description: req.body.description,
    //product: req.body.products,
  });

  category = await category.save();

  res.send(category);
});

const filterByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryName,
  }).populate('category');
  res.json(products);
});

const getProductByName = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ name: req.params.name }).populate(
    'product'
  );

  if (!category) {
    return res.status(404).send('Category not found');
  }

  res.send(category.product);
});

module.exports = {
  getAllCategories,
  addnewCategory,
  filterByCategory,
  getProductByName,
};
