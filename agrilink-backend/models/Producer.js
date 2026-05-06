// models/Producer.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    region: String,
    country: { type: String, default: 'Tunisie' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

const producerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true }, // nom de la ferme / coop
    description: String,
    imageUrl: String,
    coverImageUrl: String,
    location: locationSchema,
    categories: [String], // ex: ['Fruits & Légumes', 'Produits laitiers']
    badges: [String], // ex: ['bio', 'local']
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Producer = mongoose.model('Producer', producerSchema);
module.exports = Producer;
