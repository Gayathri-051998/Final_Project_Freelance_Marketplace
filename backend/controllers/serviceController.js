const Service = require('../models/service');

// Create Service (Freelancer)
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, freelancer: req.user._id });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Service creation failed', error: err.message });
  }
};

// Get all Services (public)
exports.getServices = async (req, res) => {
  const services = await Service.find().populate('freelancer', 'name email');
  res.json(services);
};

// Get Freelancer's own Services
exports.getMyServices = async (req, res) => {
  const services = await Service.find({ freelancer: req.user._id });
  res.json(services);
};

