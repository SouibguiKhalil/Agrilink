// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Producer = require('../models/Producer');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      producerName,
      producerDescription,
      producerLocation,
      producerCategories,
      producerBadges,
      imageUrl,
      coverImageUrl,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Nom, email et mot de passe sont obligatoires' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
      phone,
      address,
    });

    let producer = null;
    if (role === 'producer') {
      producer = await Producer.create({
        user: user._id,
        name: producerName || name,
        description: producerDescription,
        location: producerLocation,
        categories: producerCategories,
        badges: producerBadges,
        imageUrl,
        coverImageUrl,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      producer,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const producer =
      user.role === 'producer'
        ? await Producer.findOne({ user: user._id })
        : null;

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      producer,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const producerDoc =
      user.role === 'producer'
        ? await Producer.findOne({ user: user._id }).lean()
        : null;

    const producer = producerDoc
      ? {
          ...producerDoc,
          _id: producerDoc._id,
          imageUrl: producerDoc.imageUrl,
        }
      : null;

    res.json({ user, producer });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/me
const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const fields = ['name', 'phone', 'address'];
    fields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateMe };
