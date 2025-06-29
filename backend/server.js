const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contractRoutes = require('./routes/contractRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
const app = express();
app.use(express.json());
// Database connection
connectDB();

// Middleware
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Freelance Marketplace API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

