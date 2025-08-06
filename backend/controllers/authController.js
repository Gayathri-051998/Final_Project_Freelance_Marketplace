const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
const registerUser = async (req, res) => {
  console.log("🔔 Received request body:", req.body); // ✅ Add this line for debugging
  console.log("🔔 Incoming request body at /register:", req.body);
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    console.log("❌ Missing fields in request:", req.body); // Add this
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("❌ Error in registerUser:", error); // Add this
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'freelancer' }, 'name email');
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch freelancers' });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getAllFreelancers
};

