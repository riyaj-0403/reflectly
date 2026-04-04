const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createEntry,
  getEntries,
  getDashboard,
  analyzeOnly,
} = require('../controllers/journalController');

// All routes require a valid JWT
router.post('/', auth, createEntry);           // POST  /api/journal        — submit entry
router.get('/', auth, getEntries);             // GET   /api/journal        — list history
router.get('/dashboard', auth, getDashboard);  // GET   /api/journal/dashboard — stats + calendar
router.post('/analyze', auth, analyzeOnly);    // POST  /api/journal/analyze  — preview only

// Legacy alias kept for backward compat with earlier frontend code
router.get('/dashboard', auth, getDashboard);  // also served at /api/entries/dashboard via server.js

module.exports = router;
