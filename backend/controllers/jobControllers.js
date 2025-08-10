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


/*second 

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




// PUBLIC list with filters: q, minBudget, maxBudget, status, page, limit
const listJobs = async (req, res) => {
  try {
    const {
      q,
      minBudget,
      maxBudget,
     // status = 'active',
      page = 1,
      limit = 20
    } = req.query;
    const query = {};
    if (q ) {
      const rx = new RegExp(q.trim(), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { tags: rx }];
    }

    if (minBudget) {
      filter.budget = { ...(filter.budget || {}), $gte: Number(minBudget) };
    }
    if (maxBudget) {
      filter.budget = { ...(filter.budget || {}), $lte: Number(maxBudget) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('listJobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// Get all Jobs (public)
//const getJobs = async (req, res) => {
  //const jobs = await Job.find().populate('client', 'name email');
 // res.json(jobs);
//};

// GET /api/jobs?search=developer
// Get all Jobs (public) with search and filters
const getJobs = async (req, res) => {
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
const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ client: req.user._id });
  res.json(jobs);
};

// jobController.js
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('client', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

module.exports = {
  createJob,
  myJobs,
  updateJob,
  closeJob,
  archiveJob,
  duplicateJob,
  listJobs,
  getAllJobs ,
  getMyJobs,
  getJobs
};

*/


// backend/controllers/jobControllers.js
const Job = require('../models/job');

/**
 * PUBLIC: List jobs with optional filters & pagination
 * Accepts: q, status, minBudget, maxBudget, page, limit
 * Returns: { items, total, page, limit }
 */
exports.listJobs = async (req, res) => {
  try {
    const {
      q = '',
      status,
      minBudget,
      maxBudget,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }

    if (status && status !== 'any') {
      filter.status = status;  // Only add if status is not 'any'
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('client', 'name'),
      Job.countDocuments(query),
    ]);

    res.json({ items, total, page: pageNum, limit: limitNum });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

/** AUTH REQUIRED BELOW **/

// Create a job
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, tags = [], status = 'draft' } = req.body;
    const job = await Job.create({
      title,
      description,
      budget,
      tags,
      status,
      client: req.user._id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create job', error: err.message });
  }
};

// Jobs created by current user
exports.myJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch my jobs', error: err.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: id, client: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update job', error: err.message });
  }
};

// Close a job (mark as closed)
exports.closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOneAndUpdate(
      { _id: id, client: req.user._id },
      { status: 'closed' },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: 'Failed to close job', error: err.message });
  }
};

// Archive/Delete a job (simple delete for now)
exports.archiveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, client: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete job', error: err.message });
  }
};

// Duplicate a job (create a draft copy)
exports.duplicateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const src = await Job.findOne({ _id: id, client: req.user._id });
    if (!src) return res.status(404).json({ message: 'Job not found' });

    const copy = await Job.create({
      title: `${src.title} (Copy)`,
      description: src.description,
      budget: src.budget,
      tags: src.tags || [],
      status: 'draft',
      client: req.user._id,
    });

    res.status(201).json(copy);
  } catch (err) {
    res.status(400).json({ message: 'Failed to duplicate job', error: err.message });
  }
};


exports.setStatus = async (req, res) => {
  const { status } = req.body;
  if (!['draft', 'active', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  job.status = status;
  await job.save();
  res.json(job);
};


// jobControllers.js
exports.updateStatus = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(job);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
