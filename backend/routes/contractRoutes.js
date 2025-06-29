const express = require('express');
const {
  createContract,
  getContractsByUser,
  updateContractStatus,
} = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/me', protect, getContractsByUser);
router.put('/:id/status', protect, updateContractStatus);

module.exports = router;



