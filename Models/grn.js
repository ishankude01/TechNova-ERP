const mongoose = require("mongoose");

const grnSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
        purchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchaseOrder",
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

    receivedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: "Received"
    }
});

module.exports = mongoose.model("GRN", grnSchema);