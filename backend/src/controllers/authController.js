const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');

// POST /api/auth/register
async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    // 1) check existing user
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // 2) hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3) insert user (default role: customer)
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, is_active, created_at`,
      [email, passwordHash, 'customer']
    );

    const user = result.rows[0];

    // 4) issue token
    const token = signToken({ sub: user.id, role: user.role });

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ sub: user.id, role: user.role });

    // Return safe user fields only
    return res.json({
      user: { id: user.id, email: user.email, role: user.role, is_active: user.is_active },
      token,
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
