const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── DATABASE ─────────────────────────────────────────────────────────────────
connectDB();

// ─── ROUTES ───────────────────────────────────────────────────────────────────
const journalRouter = require('./routes/journal');

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/journal', journalRouter);

// Legacy alias so old frontend calls (/api/entries/...) still work
app.use('/api/entries', journalRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/', (_req, res) => res.send('Reflectly Backend v2.0 is running ✅'));

// 404 handler
app.use((_req, res) => res.status(404).json({ msg: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ msg: 'Internal server error' });
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀  Reflectly backend running on http://localhost:${PORT}`);
  console.log(`    ML service expected at: ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'}`);
});
