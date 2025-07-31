const express = require('express');
const { createJob, getJobs, getMyJobs, getAllJobs } = require('../controllers/jobControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();



router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/me', protect, getMyJobs); // existing
router.get('/my-jobs', protect, getMyJobs); // ✅ added alias route
// in routes/jobRoutes.js
router.get('/all', getAllJobs);
module.exports = router;

