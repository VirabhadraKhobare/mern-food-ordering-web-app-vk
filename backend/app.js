const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dishRoutes = require('./routes/dishes');
const ownerRoutes = require('./routes/owner');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const seedRoutes = require('./routes/seed');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seed', seedRoutes);

module.exports = app;
