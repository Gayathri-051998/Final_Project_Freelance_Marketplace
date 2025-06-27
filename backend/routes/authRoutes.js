const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user'); // ✅ Needed to query freelancers

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);

// ✅ NEW: Get all freelancers
router.get('/freelancers', protect, async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'freelancer' }).select('_id name email');
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch freelancers' });
  }
});


router.put('/me', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      await user.save();
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio });
    } catch (err) {
      res.status(500).json({ message: 'Profile update failed' });
    }
  });
  
  const bcrypt = require('bcryptjs');

router.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password incorrect' });
    }

    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to change password' });
  }
});

module.exports = router;
