const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  displayAllproducts,
  getProductById,
  deleteProduct,
  addNewProduct,
  addReview,
  updateProduct,
  getProductByName,
} = require('../controllers/productController.js');

router.route('/').get(displayAllproducts).post(protect, admin, addNewProduct);
router.route('/:id/reviews').post(protect, addReview);
router.get('/search/:name', getProductByName);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;

// old code
/*

// display all products
router.get('/', async (req, res) => {
  const products = await Product.find().sort('name');
  res.send(products);
});

// get product by id
router.get('/get/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// delete product
router.delete('/delete/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// create product
router.post('/addnew', async (req, res) => {
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

// add review
router.post('/addreview/:id', async (req, res) => {
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

// update product
router.post('/update/:id', async (req, res) => {
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

// Update Category // TODO - Not needed for now

// get product by name // TODO

router.get('/search/:name', async (req, res) => {
  const name = req.params.name;
  const products = await Product.find({
    name: { $regex: name, $options: 'i' },
  }).populate('category');

  if (!products.length) {
    return res.status(404).send(`No products found for ${name}`);
  }

  res.send(products);
});

// get all products by category name //TODO  - DONE

module.exports = router;



*/
