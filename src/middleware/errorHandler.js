const logger = require('../utils/logger');
const { CustomError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorHandler;