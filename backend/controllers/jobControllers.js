/*const Job = require('../models/job');

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
*/




const Job = require('../models/job');
// Create job
const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, client: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get my jobs
const myJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id, isArchived: false })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update job
// controllers/jobControllers.js (CommonJS)

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // 👇 Adjust this field name to your schema: client or user
    if (job.client?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this job' });
    }

    job.title = req.body.title ?? job.title;
    job.description = req.body.description ?? job.description;
    job.budget = req.body.budget ?? job.budget;
    job.tags = Array.isArray(req.body.tags) ? req.body.tags : job.tags;

    const saved = await job.save();
    return res.json(saved);
  } catch (err) {
    console.error('updateJob error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};






// Close job
const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    job.status = 'closed';
    const saved = await job.save();
    res.json(saved);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Archive (soft delete)
const archiveJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, client: req.user._id },
      { isArchived: true },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job archived' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Duplicate job
const duplicateJob = async (req, res) => {
  try {
    const original = await Job.findOne({ _id: req.params.id, client: req.user._id });
    if (!original) return res.status(404).json({ message: 'Job not found' });

    const copy = await Job.create({
      title: original.title + ' (Copy)',
      description: original.description,
      budget: original.budget,
      tags: original.tags,
      status: 'draft',
      client: req.user._id
    });

    res.status(201).json(copy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  myJobs,
  updateJob,
  closeJob,
  archiveJob,
  duplicateJob
};



