const express = require('express');
const { createJob, getJobs, getMyJobs } = require('../controllers/jobControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/me', protect, getMyJobs); // existing
router.get('/my-jobs', protect, getMyJobs); // ✅ added alias route

module.exports = router;
