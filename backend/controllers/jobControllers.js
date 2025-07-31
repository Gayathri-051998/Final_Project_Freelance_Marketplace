const Job = require('../models/job');

// Create Job (Client)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, client: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: 'Job creation failed', error: err.message });
  }
};

// Get all Jobs (public)
//exports.getJobs = async (req, res) => {
  //const jobs = await Job.find().populate('client', 'name email');
  //res.json(jobs);
//};

// GET /api/jobs?search=developer
// Get all Jobs (public) with search and filters
exports.getJobs = async (req, res) => {
  const { search = '', minBudget, maxBudget, deadline } = req.query;

  const searchRegex = new RegExp(search, 'i');
  const filter = {
    $or: [{ title: searchRegex }, { description: searchRegex }]
  };

  if (minBudget || maxBudget) {
    filter.budget = {};
    if (minBudget) filter.budget.$gte = Number(minBudget);
    if (maxBudget) filter.budget.$lte = Number(maxBudget);
  }

  if (deadline) {
    filter.deadline = { $lte: new Date(deadline) };
  }

  try {
    const jobs = await Job.find(filter).populate('client', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};



// Get Client's own Jobs
exports.getMyJobs = async (req, res) => {
  const jobs = await Job.find({ client: req.user._id });
  res.json(jobs);
};

// jobController.js
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('client', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};



