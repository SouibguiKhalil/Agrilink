// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  getReviewsForProduct,
  upsertReview,
} = require('../controllers/reviewController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Public : liste + détail
router.get('/', getProducts);
router.get('/:id', getProductById);

// Avis : lecture publique, écriture acheteur connecté
router.get('/:productId/reviews', getReviewsForProduct);
router.post(
  '/:productId/reviews',
  protect,
  requireRole('buyer'),
  upsertReview
);

// Gestion produits : producteur + admin
router.post('/', protect, requireRole('producer', 'admin'), createProduct);
router.put('/:id', protect, requireRole('producer', 'admin'), updateProduct);
router.delete('/:id', protect, requireRole('producer', 'admin'), deleteProduct);

module.exports = router;
