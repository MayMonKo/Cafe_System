const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const {
  createUser,
  getAllUsers,
  updateUserRole,
  deactivateUser
} = require('../controllers/adminUserController');

const router = express.Router();

// All routes require admin
router.use(requireAuth);
router.use(authorize(['admin']));

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/deactivate', deactivateUser);

module.exports = router;
