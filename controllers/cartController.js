const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart');

const showCart = asyncHandler(async (req, res) => {
  const myCart = await Cart.find().sort('name');
  res.send(myCart);
});

//NOTE : Meka auto hadenna one User item add krnw withri
const createCart = asyncHandler(async (req, res) => {
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

const addproduct = asyncHandler(async (req, res) => {
  const { product } = req.body;

  const cart = await Cart.findOne({ user: req.params.id }); // find the cart with the user and product the user

  if (cart) {
    cart.product.push(product);
  }

  cart.updateAllTotal();
  await cart.save();

  res.send(cart);
});

const removeProduct = asyncHandler(async (req, res) => {
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

const changeQty = asyncHandler(async (req, res) => {
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

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.userId);
  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
  } else {
    await cart.remove();
    res.status(200).json({ message: 'Cart removed' });
  }
});

module.exports = {
  showCart,
  createCart,
  addproduct,
  removeProduct,
  changeQty,
  clearCart,
};
