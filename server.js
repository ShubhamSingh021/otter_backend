require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contentRoutes = require('./routes/contentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// MIDDLEWARE
// CORS
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://ottersociety.vercel.app",
    "https://otter-frontend-iota.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// DATABASE CONNECTION
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
}).catch(err => {
  console.error('DB Connection error:', err.message);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
