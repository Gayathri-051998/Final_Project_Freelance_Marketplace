const express = require('express');
const { createJob,
    myJobs,
    updateJob,
    closeJob,
    archiveJob,
    duplicateJob } = require('../controllers/jobControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


/*
router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/me', protect, getMyJobs); // existing
router.get('/my-jobs', protect, getMyJobs); // ✅ added alias route
// in routes/jobRoutes.js
router.get('/all', getAllJobs);
*/

router.post('/', protect, createJob);
router.get('/me', protect, myJobs);
router.put('/:id', protect, updateJob);
router.patch('/:id/close', protect, closeJob);
router.delete('/:id', protect, archiveJob);
router.post('/:id/duplicate', protect, duplicateJob);
router.get('/ping', (_req, res) => res.send('jobs ok'));


module.exports = router;

