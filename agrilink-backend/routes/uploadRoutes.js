const express = require('express');
const {
  uploadProductImage,
  uploadProducerImage,
  uploadToCloudinary,
} = require('../middleware/uploadMiddleware');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/upload/products
router.post(
  '/products',
  protect,
  requireRole('producer', 'admin'),
  uploadProductImage,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier fourni' });
      }
      const result = await uploadToCloudinary(req.file, 'agrilink/products');
      res.status(201).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de l'upload" });
    }
  }
);

// POST /api/upload/producer-image
router.post(
  '/producer-image',
  protect,
  requireRole('producer', 'admin'),
  uploadProducerImage,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier fourni' });
      }
      const result = await uploadToCloudinary(req.file, 'agrilink/producers');
      res.status(201).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de l'upload" });
    }
  }
);

module.exports = router;
