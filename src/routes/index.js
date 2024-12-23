const express = require('express');
const router = express.Router();

const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const restaurantRoutes = require('./restaurant.routes');
const authRoutes = require('./auth.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/restaurant', restaurantRoutes);

module.exports = router;