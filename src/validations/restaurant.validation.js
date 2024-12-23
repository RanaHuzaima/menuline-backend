const Joi = require('joi');

const updateInventory = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    quantity: Joi.number().min(0).required()
  })
};

const createReservation = {
  body: Joi.object().keys({
    table_id: Joi.string().uuid().required(),
    reservation_time: Joi.date().iso().greater('now').required()
  })
};

module.exports = {
  updateInventory,
  createReservation
};