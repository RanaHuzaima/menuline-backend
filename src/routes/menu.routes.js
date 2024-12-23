const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const menuController = require('../controllers/menu.controller');
const menuValidation = require('../validations/menu.validation');
const validate = require('../middleware/validate');

router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItem);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  validate(menuValidation.createMenuItem),
  menuController.createMenuItem
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  validate(menuValidation.updateMenuItem),
  menuController.updateMenuItem
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  menuController.deleteMenuItem
);

module.exports = router;