const express = require('express');
const {
  createContract,
  getContractsByUser,
  updateContractStatus,
  getUsedJobIds,
  SubmitReview,
} = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/me', protect, getContractsByUser);
router.put('/:id/status', protect, updateContractStatus);
router.get('/jobs-used', protect, getUsedJobIds);

router.post('/:id/review', protect, SubmitReview);

module.exports = router;



