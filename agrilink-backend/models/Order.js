// models/Order.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    region: String,
    postalCode: String,
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producer',
      required: true,
    },
    name: { type: String, required: true }, // snapshot du nom du produit
    price: { type: Number, required: true }, // snapshot du prix unitaire
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery'],
      default: 'cash_on_delivery',
    },
    deliveryAddress: addressSchema,
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
