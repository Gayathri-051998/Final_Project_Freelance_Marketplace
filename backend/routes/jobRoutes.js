const express = require('express');
const { createJob,
    myJobs,
    updateJob,
    closeJob,
    archiveJob,
    duplicateJob,listJobs,getAllJobs ,getJobs, getMyJobs,setStatus,updateJobStatus } = require('../controllers/jobControllers');
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
//router.get('/', getJobs);
//router.get('/', getAllJobs);  
//router.get('/me', protect, getMyJobs); 


router.get('/', listJobs);

router.post('/', protect, createJob);
router.get('/me', protect, myJobs);
router.put('/:id', protect, updateJob);
router.patch('/:id/close', protect, closeJob);
router.patch('/:id/status', protect, setStatus)
router.delete('/:id', protect, archiveJob);
router.post('/:id/duplicate', protect, duplicateJob);

router.get('/ping', (_req, res) => res.send('jobs ok'));

//router.patch('/:id/status', protect, updateStatus);


module.exports = router;

