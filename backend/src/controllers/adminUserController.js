const bcrypt = require('bcrypt');
const pool = require('../config/db');

// CREATE USER (admin only)
async function createUser(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'email, password and role are required' });
  }

  const allowedRoles = ['customer', 'cashier', 'manager', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, is_active, created_at
      `,
      [email, passwordHash, role]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET ALL USERS
async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT id, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      `
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// UPDATE USER ROLE
async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ['customer', 'cashier', 'manager', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, email, role, is_active
      `,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('updateUserRole error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// DEACTIVATE USER (soft delete)
async function deactivateUser(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET is_active = false
      WHERE id = $1
      RETURNING id, email, role, is_active
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('deactivateUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  updateUserRole,
  deactivateUser
};
