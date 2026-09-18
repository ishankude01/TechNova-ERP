const Joi = require("joi");

const purchaseOrderValidation = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
    supplierName: Joi.string().required(),
    status: Joi.string()
        .valid("Pending", "Approved", "Received", "Cancelled")
        .optional()
});

module.exports = purchaseOrderValidation;