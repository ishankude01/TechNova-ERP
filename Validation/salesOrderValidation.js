const Joi = require("joi");

const salesOrderValidation = Joi.object({
    productId: Joi.string()
        .hex()
        .length(24)
        .required(),

    quantity: Joi.number()
        .integer()
        .positive()
        .required(),

    customerName: Joi.string()
        .required(),

    orderDate: Joi.date()
        .required(),

    status: Joi.string()
        .valid(
            "Pending",
            "Approved",
            "Delivered",
            "Cancelled"
        )
        .optional()
});

module.exports = salesOrderValidation;