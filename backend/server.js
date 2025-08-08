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

const paymentRoutes = require('./routes/paymentRoutes');



dotenv.config();
const app = express();
app.use(express.json());
// Database connection
connectDB();

// Middleware
/*const allowedOrigins = [
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));*/


// ✅ Use this before any routes or middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://dashing-bienenstitch-f7f9b5.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests globally
app.options('*', cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Freelance Marketplace API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/api/ping', (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

app.get('/api/ping', (req, res) => {
  res.send("✅ Server is live");
});