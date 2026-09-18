const Product = require("../Models/product");
const Order = require("../Models/order");

const getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            status: "Pending"
        });

        const completedOrders = await Order.countDocuments({
            status: "Completed"
        });

        res.status(200).json({
            totalProducts,
            totalOrders,
            pendingOrders,
            completedOrders
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
};

module.exports = { getDashboard };