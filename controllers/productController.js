const asyncHandler = require('express-async-handler');
const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');

const displayAllproducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort('name');
  res.send(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const addNewProduct = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description, price, category } = req.body;

  const stock = Number(req.body.stock);

  const product = await new Product({
    name: name,
    description: description,
    price: price,
    stock: stock,
  });

  // Add categories to the product object
  product.category.push(...category);

  // Save the product to the database
  await product.save();

  // Update the category with the new product ID
  // use await before Promise.all() to make sure that all updates are completed before sending the response.
  await Promise.all(
    category.map(async (categoryObj) => {
      const categoryId = categoryObj._id;
      await Category.updateOne(
        { _id: categoryId },
        { $push: { product: product._id } }
      );
    })
  );

  // Return the product as response
  res.send(product);
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  console.log(product);

  if (product) {
    const alreadyReviewed = product.review.find(
      (r) => r.user.toString() === req.body._id.toString()
    );

    if (alreadyReviewed)
      return res.status(400).send('Product already reviewed');

    const review = {
      name: req.body.name,
      rating: Number(rating),
      comment,
      user: req.body._id,
    };

    product.review.push(review);

    product.numReviews = product.review.length;

    await product.save();

    res.send(review);
  } else {
    res.send('Product not found');
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, stock, category } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    //product.image = image;
    product.stock = stock;

    product.category.push(...category);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getProductByName = asyncHandler(async (req, res) => {
  const name = req.params.name;
  const products = await Product.find({
    name: { $regex: name, $options: 'i' },
  }).populate('category');

  if (!products.length) {
    return res.status(404).send(`No products found for ${name}`);
  }

  res.send(products);
});

// Update Category // TODO - Not needed for now
// get all products by category name //TODO  - DONE
module.exports = {
  displayAllproducts,
  getProductById,
  deleteProduct,
  addNewProduct,
  addReview,
  updateProduct,
  getProductByName,
};
