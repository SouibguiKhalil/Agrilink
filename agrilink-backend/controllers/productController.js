// controllers/productController.js
const Product = require('../models/Product');
const Producer = require('../models/Producer');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, label, q, producerId } = req.query;

    const filter = { isActive: true, status: 'approved' };

    if (category) filter.category = category;
    if (label) filter.badges = label;
    if (producerId) filter.producer = producerId;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter)
      .populate({
        path: 'producer',
        select: 'name location',
      })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'producer',
      select: 'name location',
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    let producerId = null;

    if (req.user.role === 'producer') {
      const producer = await Producer.findOne({ user: req.user._id });
      if (!producer) {
        return res
          .status(400)
          .json({ message: 'Profil producteur introuvable' });
      }
      producerId = producer._id;
    } else if (req.user.role === 'admin') {
      producerId = req.body.producerId;
    }

    if (!producerId) {
      return res
        .status(400)
        .json({ message: 'Producteur non spécifié pour ce produit' });
    }

    const {
      name,
      description,
      price,
      unit,
      stock,
      category,
      images,
      badges,
      details,
      imageUrl,
    } = req.body;

    if (!name || !price || !unit || !category) {
      return res.status(400).json({
        message: 'Nom, prix, unité et catégorie sont obligatoires',
      });
    }

    const finalImages =
      (images && images.length > 0 && images) ||
      (imageUrl ? [imageUrl] : []);

    const product = await Product.create({
      producer: producerId,
      name,
      description,
      price,
      unit,
      stock,
      category,
      images: finalImages,
      badges,
      details,
      status: 'approved',
      isActive: true,
    });

    const populated = await product.populate({
      path: 'producer',
      select: 'name location',
    });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('producer');

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    if (req.user.role !== 'admin') {
      const producer = await Producer.findOne({ user: req.user._id });
      if (
        !producer ||
        producer._id.toString() !== product.producer._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Vous ne pouvez pas modifier ce produit' });
      }
    }

    const fields = [
      'name',
      'description',
      'price',
      'unit',
      'stock',
      'category',
      'images',
      'badges',
      'details',
      'isActive',
      'status',
    ];

    fields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    const populated = await updated.populate({
      path: 'producer',
      select: 'name location',
    });

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('producer');

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    if (req.user.role !== 'admin') {
      const producer = await Producer.findOne({ user: req.user._id });
      if (
        !producer ||
        producer._id.toString() !== product.producer._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Vous ne pouvez pas supprimer ce produit' });
      }
    }

    await product.deleteOne();

    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
