// controllers/producerController.js
const Producer = require('../models/Producer');
const Product = require('../models/Product');

// GET /api/producers
const getProducers = async (req, res, next) => {
  try {
    const { category, label, city, search } = req.query;

    const filter = {};

    if (category) filter.categories = category;
    if (label) filter.badges = label;
    if (city) filter['location.city'] = city;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const producers = await Producer.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(producers);
  } catch (err) {
    next(err);
  }
};

// GET /api/producers/:id
const getProducerById = async (req, res, next) => {
  try {
    const producer = await Producer.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!producer) {
      return res.status(404).json({ message: 'Producteur introuvable' });
    }

    const products = await Product.find({
      producer: producer._id,
      isActive: true,
      status: 'approved',
    });

    res.json({ producer, products });
  } catch (err) {
    next(err);
  }
};

// PUT /api/producers/me
const updateMyProducerProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'producer') {
      return res
        .status(403)
        .json({ message: 'Réservé aux comptes producteurs' });
    }

    const producer = await Producer.findOne({ user: req.user._id });
    if (!producer) {
      return res
        .status(404)
        .json({ message: 'Profil producteur introuvable' });
    }

    const fields = [
      'name',
      'description',
      'imageUrl',
      'coverImageUrl',
      'location',
      'categories',
      'badges',
    ];

    fields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        producer[field] = req.body[field];
      }
    });

    const updated = await producer.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducers, getProducerById, updateMyProducerProfile };
