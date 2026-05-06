// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

// Un acheteur = un seul avis par produit
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
