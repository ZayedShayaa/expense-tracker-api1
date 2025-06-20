const Joi = require('joi');

const createExpenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  incurred_at: Joi.date().required(),
});

const updateExpenseSchema = Joi.object({
  amount: Joi.number().positive(),
  category: Joi.string().trim(),
  description: Joi.string().allow('', null),
  incurred_at: Joi.date(),
}).min(1); // At least one field must be present

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
};
