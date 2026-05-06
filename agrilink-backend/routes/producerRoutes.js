// routes/producerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducers,
  getProducerById,
  updateMyProducerProfile,
} = require('../controllers/producerController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// D'abord la route /me pour éviter le conflit avec /:id
router.put('/me', protect, requireRole('producer'), updateMyProducerProfile);

// Public : liste + détail
router.get('/', getProducers);
router.get('/:id', getProducerById);

module.exports = router;
