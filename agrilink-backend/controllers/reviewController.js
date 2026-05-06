// controllers/reviewController.js
const Review = require('../models/Review');

// GET /api/products/:productId/reviews
const getReviewsForProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:productId/reviews
const upsertReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'La note doit être entre 1 et 5' });
    }

    const filter = {
      product: req.params.productId,
      buyer: req.user._id,
    };

    const update = { rating, comment };

    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    };

    const review = await Review.findOneAndUpdate(filter, update, options).populate(
      'buyer',
      'name'
    );

    res.json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviewsForProduct, upsertReview };
