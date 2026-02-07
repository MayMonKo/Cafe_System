const pool = require('../config/db');
const { redeemPoints, earnPoints } = require('../services/loyaltyService');
const { applyDiscount } = require('../services/discountService');

// CUSTOMER / CASHIER — CREATE ORDER
// POST /api/orders
async function createOrder(req, res) {
  const userId = req.user.sub;
  const userRole = req.user.role;
  const { items, dine_in, payment_method } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain items' });
  }

  try {
    await pool.query('BEGIN');

    // Walk-in orders use guest user (id = 4 from seed)
    const customerId = userRole === 'cashier' ? 4 : userId;

    let totalAmount = 0;

    // 1️⃣ Create order
    const orderResult = await pool.query(
      `
      INSERT INTO orders (customer_id, status, total_amount)
      VALUES ($1, 'pending', 0)
      RETURNING id
      `,
      [customerId]
    );

    const orderId = orderResult.rows[0].id;

    // 2️⃣ Insert items
    for (const item of items) {
      const { product_id, quantity, unit_price, options } = item;
      totalAmount += unit_price * quantity;

      const itemResult = await pool.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [orderId, product_id, quantity, unit_price]
      );

      const orderItemId = itemResult.rows[0].id;

      // 3️⃣ Insert options (customizations)
      if (options && options.length > 0) {
        for (const opt of options) {
          await pool.query(
            `
            INSERT INTO order_item_options
            (order_item_id, option_name, option_value, price_modifier)
            VALUES ($1, $2, $3, $4)
            `,
            [
              orderItemId,
              opt.option_name,
              opt.option_value,
              opt.price_modifier || 0,
            ]
          );
          totalAmount += opt.price_modifier || 0;
        }
      }
    }

    // 4️⃣ Update total
    await pool.query(
      `UPDATE orders SET total_amount = $1 WHERE id = $2`,
      [totalAmount, orderId]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Order created',
      order_id: orderId,
      total_amount: totalAmount,
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// CUSTOMER — VIEW OWN ORDERS
// GET /api/orders/my
async function getMyOrders(req, res) {
  const userId = req.user.sub;

  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE customer_id = $1
    ORDER BY order_time DESC
    `,
    [userId]
  );

  res.json(result.rows);
}

// CASHIER / MANAGER — VIEW ALL ORDERS
// GET /api/orders
async function getAllOrders(req, res) {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    ORDER BY order_time DESC
    `
  );

  res.json(result.rows);
}

// CASHIER — UPDATE ORDER STATUS
// PATCH /api/orders/:id/status
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    'paid',
    'preparing',
    'ready',
    'completed',
    'cancelled',
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order: result.rows[0],
    });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Redeem points
async function redeemOrderPoints(req, res) {
  const userId = req.user.sub;
  const { id } = req.params;
  const { points } = req.body;

  try {
    await redeemPoints(userId, id, points);
    res.json({ message: 'Points redeemed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  redeemOrderPoints
};
