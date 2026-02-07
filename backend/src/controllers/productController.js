const pool = require('../config/db');

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.base_price,
        p.is_active,
        c.name AS category
      FROM products p
      JOIN product_categories c ON c.id = p.category_id
      WHERE p.is_active = TRUE
      ORDER BY c.name, p.name
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/products (manager)
async function createProduct(req, res) {
  const { name, category_id, base_price } = req.body;

  if (!name || !category_id || !base_price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO products (name, category_id, base_price)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, category_id, base_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/products/:id (manager)
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, base_price, is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET
        name = COALESCE($1, name),
        base_price = COALESCE($2, base_price),
        is_active = COALESCE($3, is_active)
      WHERE id = $4
      RETURNING *
      `,
      [name, base_price, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
};
