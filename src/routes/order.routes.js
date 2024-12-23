const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const orderController = require('../controllers/order.controller');
const orderValidation = require('../validations/order.validation');
const validate = require('../middleware/validate');

router.get(
  '/',
  authenticateToken,
  orderController.getAllOrders
);

router.get(
  '/:id',
  authenticateToken,
  validate(orderValidation.getOrder),
  orderController.getOrder
);

router.post(
  '/',
  authenticateToken,
  validate(orderValidation.createOrder),
  orderController.createOrder
);

router.put(
  '/:id/status',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  validate(orderValidation.updateOrderStatus),
  orderController.updateOrderStatus
);

router.delete(
  '/:id',
  authenticateToken,
  validate(orderValidation.cancelOrder),
  orderController.cancelOrder
);

module.exports = router;