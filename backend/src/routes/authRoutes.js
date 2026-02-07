const express = require('express');
const { register, login } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected test route: GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  // req.user.sub is userId, req.user.role is role
  const userId = req.user.sub;

  const result = await pool.query(
    'SELECT id, email, role, is_active, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: result.rows[0] });
});

module.exports = router;
