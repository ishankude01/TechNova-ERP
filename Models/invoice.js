const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    salesOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesOrder",
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    invoiceDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Unpaid", "Paid", "Cancelled"],
        default: "Unpaid"
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);