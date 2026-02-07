const pool = require('../config/db');

// Earn points when order is completed
async function earnPoints(userId, orderId, amount) {
  const points = Math.floor(amount);

  await pool.query(
    `
    INSERT INTO loyalty_points_ledger
    (user_id, order_id, txn_type, points_change, reason)
    VALUES ($1, $2, 'earn', $3, 'Order completed')
    `,
    [userId, orderId, points]
  );

  await pool.query(
    `
    UPDATE users
    SET points_balance = points_balance + $1
    WHERE id = $2
    `,
    [points, userId]
  );
}

// Redeem points during checkout
async function redeemPoints(userId, orderId, points) {
  const user = await pool.query(
    `SELECT points_balance FROM users WHERE id = $1`,
    [userId]
  );

  if (user.rows[0].points_balance < points) {
    throw new Error('Insufficient points');
  }

  await pool.query(
    `
    INSERT INTO loyalty_points_ledger
    (user_id, order_id, txn_type, points_change, reason)
    VALUES ($1, $2, 'redeem', $3, 'Redeemed on order')
    `,
    [userId, orderId, -points]
  );

  await pool.query(
    `
    UPDATE users
    SET points_balance = points_balance - $1
    WHERE id = $2
    `,
    [points, userId]
  );
}

module.exports = { earnPoints, redeemPoints };
