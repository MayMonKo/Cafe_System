const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const rbacTestRoutes = require('./routes/rbacTestRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/rbac-test', rbacTestRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminUserRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: "Bear's Bakery backend is running 🐻🍞" });
});

// Mount routes
app.use('/api/auth', authRoutes);

module.exports = app;
