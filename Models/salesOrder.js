const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema({
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

    orderDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Delivered", "Cancelled"],
        default: "Pending"
    }
});

module.exports = mongoose.model("SalesOrder", salesOrderSchema);