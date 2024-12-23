const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authValidation = require('../validations/auth.validation');

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
);

router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

router.post(
  '/logout',
  authController.logout
);

module.exports = router;