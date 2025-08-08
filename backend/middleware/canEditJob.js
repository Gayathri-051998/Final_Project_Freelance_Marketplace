// middleware/canEditJob.js
const Job = require('../models/job');
module.exports = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job || job.client.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  next();
};
