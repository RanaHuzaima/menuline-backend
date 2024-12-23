const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const statsController = require('../controllers/restaurant/stats.controller');
const inventoryController = require('../controllers/restaurant/inventory.controller');
const tablesController = require('../controllers/restaurant/tables.controller');
const restaurantValidation = require('../validations/restaurant.validation');
const validate = require('../middleware/validate');

// Stats routes
router.get(
  '/stats',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  statsController.getRestaurantStats
);

// Inventory routes
router.get(
  '/inventory',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  inventoryController.getInventoryStatus
);

router.put(
  '/inventory/:id',
  authenticateToken,
  authorizeRole(['admin', 'staff']),
  validate(restaurantValidation.updateInventory),
  inventoryController.updateInventoryItem
);

// Table management routes
router.get(
  '/tables',
  authenticateToken,
  tablesController.getTableStatus
);

router.post(
  '/tables/reservations',
  authenticateToken,
  validate(restaurantValidation.createReservation),
  tablesController.createReservation
);

module.exports = router;