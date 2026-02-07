const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const {
  getAllProducts,
  createProduct,
  updateProduct,
} = require('../controllers/productController');

const router = express.Router();

// Anyone logged in can view menu
router.get('/', requireAuth, getAllProducts);

// Manager-only
router.post('/', requireAuth, authorize(['manager']), createProduct);
router.patch('/:id', requireAuth, authorize(['manager']), updateProduct);

module.exports = router;
