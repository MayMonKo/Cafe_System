const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Only admin
router.get(
  '/admin-only',
  requireAuth,
  authorize(['admin']),
  (req, res) => {
    res.json({ message: 'Hello Admin' });
  }
);

// Manager + Admin
router.get(
  '/manager-only',
  requireAuth,
  authorize(['manager', 'admin']),
  (req, res) => {
    res.json({ message: 'Hello Manager' });
  }
);

// Cashier only
router.get(
  '/cashier-only',
  requireAuth,
  authorize(['cashier']),
  (req, res) => {
    res.json({ message: 'Hello Cashier' });
  }
);

module.exports = router;
