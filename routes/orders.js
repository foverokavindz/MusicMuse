const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  addOrderPoducts,
  getOrderById,
  getMyOrders,
  getOrdersAll,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require('../controllers/ordersController.js');

router
  .route('/')
  .post(protect, addOrderPoducts)
  .get(protect, admin, getOrdersAll);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;

// old Code
/*

const Order = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//   addOrderItems
router.post('/addnew', async (req, res) => {
  const { userId, orderItems, address, total } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = await new Order({
      user: userId,
      address: address,
    });

    order.orderItems.push(...orderItems);
    order.updateItemTotal();
    order.updateAllTotal();

    const createdOrder = await order.save();

    res.send(createdOrder);
  }
});

//   getOrderById
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.send(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//   getMyOrders
router.get('/myorders/:id', async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});

//   getOrders
router.get('/', async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

//   updateOrderToPaid
router.put('/paid/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//   updateOrderToDelivered
router.put('/deleverd/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = router;



*/
