
// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS — reads allowed origin from env instead of hardcoding localhost
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging — only in dev to keep prod logs clean
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// General rate limit on all API routes (auth routes have their own stricter limit)
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CodeCarbon API Running '
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth/github', require('./routes/githubAuthRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/repositories', require('./routes/repositoryRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));

// Error handling — must be last
app.use(notFound);
app.use(errorHandler);

module.exports = app;
