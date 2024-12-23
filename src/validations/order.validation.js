const Joi = require('joi');

const getOrder = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array().items(
      Joi.object().keys({
        menu_item_id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).min(1).required()
  })
};

const updateOrderStatus = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')
      .required()
  })
};

const cancelOrder = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

module.exports = {
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
};