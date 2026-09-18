const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    supplierName: {
        type: String,
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Received", "Cancelled"],
        default: "Pending"
    }
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);