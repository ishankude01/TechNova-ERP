const Joi = require("joi");

const grnValidation = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    purchaseOrderId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
    supplierName: Joi.string().required(),
    status: Joi.string()
        .valid("Received")
        .optional()
});

module.exports = grnValidation;