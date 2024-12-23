const Joi = require('joi');

const createMenuItem = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    is_available: Joi.boolean().default(true)
  })
};

const updateMenuItem = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().positive(),
    category: Joi.string(),
    is_available: Joi.boolean()
  }).min(1)
};

module.exports = {
  createMenuItem,
  updateMenuItem
};