const Service = require('../models/service');

// ✅ Create Service (for freelancer)
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, freelancer: req.user._id });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Service creation failed', error: err.message });
  }
};

// ✅ Public: Get all services with optional search and price filters
exports.getAllServices = async (req, res) => {
  console.log('✅ getAllServices triggered with query:', req.query); // <== ADD THIS
  const { search = '', minPrice, maxPrice } = req.query;

  const filter = {
    $or: [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ]
  };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  try {
    const services = await Service.find(filter).populate('freelancer', 'name');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

// ✅ Get services posted by logged-in freelancer
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ freelancer: req.user._id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your services', error: err.message });
  }
};
