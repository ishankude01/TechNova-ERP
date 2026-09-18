const SalesOrder = require("../Models/salesOrder");

const createSalesOrder = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            customerName,
            orderDate,
            status
        } = req.body;

        const salesOrder = new SalesOrder({
            productId,
            quantity,
            customerName,
            orderDate: orderDate || undefined,
            status: status || "Pending"
        });

        await salesOrder.save();

        res.status(201).json({
            message: "Sales Order created successfully!",
            salesOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating Sales Order",
            error: error.message
        });
    }
};


const getSalesOrders = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many orders to skip
        const skip = (page - 1) * limit;

        // Search text
        const search = req.query.search || "";

        // Search by customer name or status
        const searchFilter = search
            ? {
                  $or: [
                      {
                          customerName: {
                              $regex: search,
                              $options: "i"
                          }
                      },
                      {
                          status: {
                              $regex: search,
                              $options: "i"
                          }
                      }
                  ]
              }
            : {};

        // Get sales orders
        const salesOrders = await SalesOrder.find(searchFilter)
            .populate("productId")
            .skip(skip)
            .limit(limit);

        // Count matching sales orders
        const totalSalesOrders =
            await SalesOrder.countDocuments(searchFilter);

        res.status(200).json({
            salesOrders,
            pagination: {
                currentPage: page,
                totalPages:
                    Math.ceil(totalSalesOrders / limit),
                totalSalesOrders,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching sales orders",
            error: error.message
        });
    }
};


const getSalesOrderById = async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(
            req.params.id
        ).populate("productId");

        if (!salesOrder) {
            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        res.status(200).json({
            salesOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching Sales Order",
            error: error.message
        });
    }
};


const updateSalesOrder = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            customerName,
            orderDate,
            status
        } = req.body;

        const updateData = {
            quantity,
            customerName,
            orderDate,
            status
        };

        // Update product only when productId is provided
        if (productId) {
            updateData.productId = productId;
        }

        const salesOrder =
            await SalesOrder.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            ).populate("productId");

        if (!salesOrder) {
            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        res.status(200).json({
            message: "Sales Order updated successfully!",
            salesOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating Sales Order",
            error: error.message
        });
    }
};


const deleteSalesOrder = async (req, res) => {
    try {
        const salesOrder =
            await SalesOrder.findByIdAndDelete(
                req.params.id
            );

        if (!salesOrder) {
            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        res.status(200).json({
            message: "Sales Order deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting Sales Order",
            error: error.message
        });
    }
};


module.exports = {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder
};