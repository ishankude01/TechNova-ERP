const Order = require("../Models/order");

const createOrder = async (req, res) => {
    try {
        const { productId, quantity, customerName } = req.body;

        const order = new Order({
            productId,
            quantity,
            customerName
        });

        await order.save();

        res.status(201).json({
            message: "Order created successfully!",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json({
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching order",
            error: error.message
        });
    }
};
const updateOrder = async (req, res) => {
    try {
        const { quantity, customerName, status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { quantity, customerName, status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order updated successfully!",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating order",
            error: error.message
        });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
};

module.exports = { createOrder, getOrders,  getOrderById, updateOrder, deleteOrder };