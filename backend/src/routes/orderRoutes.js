const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  redeemOrderPoints,
} = require('../controllers/orderController');

const router = express.Router();

// Create order (customer + cashier)
router.post(
  '/',
  requireAuth,
  authorize(['customer', 'cashier']),
  createOrder
);

// Customer — own orders
router.get(
  '/my',
  requireAuth,
  authorize(['customer']),
  getMyOrders
);

// Cashier + Manager — all orders
router.get(
  '/',
  requireAuth,
  authorize(['cashier', 'manager']),
  getAllOrders
);

// Cashier — update order status
router.patch(
  '/:id/status',
  requireAuth,
  authorize(['cashier']),
  updateOrderStatus
);

router.post(
  '/:id/redeem-points',
  requireAuth,
  authorize(['customer']),
  redeemOrderPoints
);

module.exports = router;
