const express = require('express');
const { createService, getServices, getMyServices,getAllServices } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//router.get('/', getServices);
router.post('/', protect, createService);
router.get('/me', protect, getMyServices);
router.get('/', getAllServices);

module.exports = router;

