const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  showCart,
  createCart,
  addproduct,
  removeProduct,
  changeQty,
  clearCart,
} = require('../controllers/cartController.js');

router
  .route('/')
  .get(protect, showCart)
  .post(
    protect,
    createCart /*NOTE : Meka auto hadenna one User item add krnw withri */
  );
router.route('/addnew/:id').post(protect, addproduct);

router.route('/removeitem/:itemId/:userId').delete(protect, removeProduct);
router.route('/removeitem/:itemId/:userId').put(protect, changeQty);
router.route('/remove/:userId').delete(protect, clearCart);

module.exports = router;

//old code

/*



const Cart = require('../models/cart');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Show Cart (display all)
router.get('/', async (req, res) => {
  const myCart = await Cart.find().sort('name');
  res.send(myCart);
});

// create Cart
router.post('/create', async (req, res) => {
  const { userId, product } = req.body;

  const myCart = await new Cart({
    user: userId,
  });

  // // convert types to save
  // const newProduct = {
  //   productId: product.productId, // name of the product. e.g. "Milk" or "Bread"
  //   name: product.name,
  //   price: product.price, // price of the product. e.g. 2.95 or 5.00. Note: this is a string.
  //   quantity: product.quantity,
  //   total: parseFloat(product.price) * parseFloat(product.quantity), // number of items. e.g. 1 or 2.  Note: this is an integer.
  // };

  myCart.product.push(...product);

  myCart.updateAllTotal();
  await myCart.save();

  res.send(myCart);
});

// add Item to cart
router.post('/addnew/:id', async (req, res) => {
  const { product } = req.body;

  const cart = await Cart.findOne({ user: req.params.id }); // find the cart with the user and product the user

  if (cart) {
    cart.product.push(product);
  }

  cart.updateAllTotal();
  await cart.save();

  res.send(cart);
});

// remove Item
router.delete('/removeitem/:itemId/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });

  if (cart) {
    for (let productObject = 0; productObject < cart.product.length; i++) {
      const product = cart.product[productObject];

      // Check if this is the object you want to remove
      if (product.productId.toString() === req.params.itemId.toString()) {
        // Use splice to remove the object from the array
        cart.product.splice(productObject, 1);
        break;
      }
    }

    cart.updateAllTotal();
    await cart.save();
    res.send(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// Change Quantity
router.put('/changeqty/:itemId/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });

  if (cart) {
    for (let productObject = 0; productObject < cart.product.length; i++) {
      const product = cart.product[productObject];

      // Check if this is the object you want to remove
      if (product.productId.toString() === req.params.itemId.toString()) {
        product.quantity = req.body.quantity;
        cart.updateItemTotal();

        break;
      }
    }

    cart.updateAllTotal();
    await cart.save();
    res.send(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// clear cart (after order success) or (User req)
router.delete('/remove/:userId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
    } else {
      await cart.remove();
      res.status(200).json({ message: 'Cart removed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;



*/
