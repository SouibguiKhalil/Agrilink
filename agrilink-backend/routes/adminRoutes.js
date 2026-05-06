// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Toutes les routes admin nécessitent admin
router.use(protect, requireRole('admin'));

router.get('/stats/overview', getOverviewStats);
router.get('/products/pending', getPendingProducts);
router.patch('/products/:id/approve', approveProduct);
router.patch('/products/:id/reject', rejectProduct);

module.exports = router;
