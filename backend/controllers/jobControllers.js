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
exports.getJobs = async (req, res) => {
  const jobs = await Job.find().populate('client', 'name email');
  res.json(jobs);
};

// Get Client's own Jobs
exports.getMyJobs = async (req, res) => {
  const jobs = await Job.find({ client: req.user._id });
  res.json(jobs);
};
