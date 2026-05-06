// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getMyProducerOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Créer une commande (acheteur)
router.post('/', protect, requireRole('buyer'), createOrder);

// Commandes acheteur connecté
router.get('/me', protect, requireRole('buyer'), getMyOrders);

// Commandes producteur connecté
router.get(
  '/producer/me',
  protect,
  requireRole('producer'),
  getMyProducerOrders
);

// Détail commande
router.get('/:id', protect, getOrderById);

// Mise à jour du statut (producteur ou admin)
router.patch(
  '/:id/status',
  protect,
  requireRole('producer', 'admin'),
  updateOrderStatus
);

module.exports = router;
