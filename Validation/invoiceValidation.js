const Joi = require("joi");

const invoiceValidation = Joi.object({
    salesOrderId: Joi.string().hex().length(24).required(),
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
    customerName: Joi.string().required(),
    amount: Joi.number().positive().required(),
    status: Joi.string()
        .valid("Unpaid", "Paid", "Cancelled")
        .optional()
});

module.exports = invoiceValidation;