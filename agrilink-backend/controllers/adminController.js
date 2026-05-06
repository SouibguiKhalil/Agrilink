// controllers/adminController.js
const User = require('../models/User');
const Producer = require('../models/Producer');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/admin/stats/overview
const getOverviewStats = async (req, res, next) => {
  try {
    const [usersCount, producersCount, productsCount, ordersCount] =
      await Promise.all([
        User.countDocuments(),
        Producer.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
      ]);

    res.json({
      usersCount,
      producersCount,
      productsCount,
      ordersCount,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/products/pending
const getPendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'pending' }).populate(
      'producer',
      'name'
    );

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/products/:id/approve
const approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    product.status = 'approved';
    const updated = await product.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/products/:id/reject
const rejectProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    product.status = 'rejected';
    const updated = await product.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverviewStats,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};
