// models/Product.js
const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema(
  {
    origine: String,
    production: String,
    saison: String,
    conservation: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producer',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }, // ex: 'kg', 'pièce'
    stock: { type: Number, default: 0, min: 0 },
    images: [String], // URLs d'images
    badges: [String], // 'bio', 'local', 'saisonnier', 'promo'
    details: productDetailsSchema,
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // ou 'pending' si tu veux validation admin
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
