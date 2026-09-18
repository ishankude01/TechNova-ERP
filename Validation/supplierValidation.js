const Joi = require("joi");

const supplierValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required()
});

module.exports = supplierValidation;