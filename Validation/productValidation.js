const Joi = require("joi");

const productValidation = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    category: Joi.string().required()
});

module.exports = productValidation;