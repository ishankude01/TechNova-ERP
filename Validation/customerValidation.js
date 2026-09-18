const Joi = require("joi");

const customerValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required()
});

module.exports = customerValidation;