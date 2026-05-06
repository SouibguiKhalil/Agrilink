// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Producer = require('../models/Producer');

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
      status: 'approved',
    }).populate('producer');

    if (products.length !== items.length) {
      return res
        .status(400)
        .json({ message: 'Un ou plusieurs produits sont invalides' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) continue;

      const quantity = item.quantity || 1;
      const lineTotal = product.price * quantity;
      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        producer: product.producer._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity,
      });
    }

    const deliveryFee = 0; // à ajuster si tu veux
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
    });

    const populated = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'name price unit images producer',
        populate: {
          path: 'producer',
          select: 'name',
        },
      });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/me (acheteur)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'name price unit images producer',
        populate: {
          path: 'producer',
          select: 'name',
        },
      });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/producer/me (producteur)
const getMyProducerOrders = async (req, res, next) => {
  try {
    const producer = await Producer.findOne({ user: req.user._id });
    if (!producer) {
      return res
        .status(404)
        .json({ message: 'Profil producteur introuvable' });
    }

    const orders = await Order.find({
      'items.producer': producer._id,
    })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'name price unit images producer',
        populate: {
          path: 'producer',
          select: 'name',
        },
      });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'name price unit images producer',
        populate: {
          path: 'producer',
          select: 'name',
        },
      });

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    const isBuyer =
      order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    let isProducer = false;
    if (req.user.role === 'producer') {
      const producer = await Producer.findOne({ user: req.user._id });
      if (producer) {
        isProducer = order.items.some(
          (item) => item.producer.toString() === producer._id.toString()
        );
      }
    }

    if (!isBuyer && !isProducer && !isAdmin) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    let isProducer = false;
    if (req.user.role === 'producer') {
      const producer = await Producer.findOne({ user: req.user._id });
      if (producer) {
        isProducer = order.items.some(
          (item) => item.producer.toString() === producer._id.toString()
        );
      }
    }

    const isAdmin = req.user.role === 'admin';

    if (!isProducer && !isAdmin) {
      return res
        .status(403)
        .json({ message: 'Vous ne pouvez pas modifier ce statut' });
    }

    order.status = status;
    const updated = await order.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyProducerOrders,
  getOrderById,
  updateOrderStatus,
};
