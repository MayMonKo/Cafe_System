const pool = require('../config/db');

async function applyDiscount(orderId, discountCode) {
  const discount = await pool.query(
    `
    SELECT *
    FROM discounts
    WHERE code = $1
      AND is_active = TRUE
      AND (starts_at IS NULL OR starts_at <= NOW())
      AND (ends_at IS NULL OR ends_at >= NOW())
    `,
    [discountCode]
  );

  if (discount.rows.length === 0) {
    throw new Error('Invalid or expired discount');
  }

  const order = await pool.query(
    `SELECT total_amount FROM orders WHERE id = $1`,
    [orderId]
  );

  const total = order.rows[0].total_amount;

  if (total < discount.rows[0].min_spend) {
    throw new Error('Minimum spend not met');
  }

  let discountAmount =
    discount.rows[0].discount_type === 'percentage'
      ? (total * discount.rows[0].amount) / 100
      : discount.rows[0].amount;

  await pool.query(
    `
    INSERT INTO order_discounts (order_id, discount_id, discount_amount)
    VALUES ($1, $2, $3)
    `,
    [orderId, discount.rows[0].id, discountAmount]
  );

  await pool.query(
    `
    UPDATE orders
    SET total_amount = total_amount - $1
    WHERE id = $2
    `,
    [discountAmount, orderId]
  );

  return discountAmount;
}

module.exports = { applyDiscount };
