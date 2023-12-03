const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        //image: { type: String, required: true },
        price: { type: String, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        total: { type: Number, required: true },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    address: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1000,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card'],
    },
    // paymentResult: {
    //   id: { type: String },
    //   status: { type: String },
    //   update_time: { type: String },
    //   email_address: { type: String },
    // },
    // taxPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },
    // shippingPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// item-wise total
orderSchema.methods.updateItemTotal = function () {
  let total = 0;
  this.orderItems.forEach((item) => {
    item.total = parseFloat(item.quantity) * parseFloat(item.price);
  });
  this.total = total;
};

// update all ordered items total
orderSchema.methods.updateAllTotal = function () {
  let total = 0;
  this.orderItems.forEach((item) => {
    total += parseFloat(item.total);
  });
  this.total = total;
};

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
