const PurchaseOrder = require("../Models/purchaseOrder");

const createPurchaseOrder = async (req, res) => {
    try {
        const { productId, quantity, supplierName } = req.body;

        const purchaseOrder = new PurchaseOrder({
            productId,
            quantity,
            supplierName
        });

        await purchaseOrder.save();

        res.status(201).json({
            message: "Purchase Order created successfully!",
            purchaseOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating Purchase Order",
            error: error.message
        });
    }
};


const getPurchaseOrders = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many orders to skip
        const skip = (page - 1) * limit;

        // Search text
        const search = req.query.search || "";

        // Search by supplier name or status
        const searchFilter = search
            ? {
                  $or: [
                      { supplierName: { $regex: search, $options: "i" } },
                      { status: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        // Get purchase orders
        const purchaseOrders = await PurchaseOrder.find(searchFilter)
            .populate("productId")
            .skip(skip)
            .limit(limit);

        // Count matching purchase orders
        const totalPurchaseOrders = await PurchaseOrder.countDocuments(searchFilter);

        res.status(200).json({
            purchaseOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPurchaseOrders / limit),
                totalPurchaseOrders,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching purchase orders",
            error: error.message
        });
    }
};


const getPurchaseOrderById = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id);

        if (!purchaseOrder) {
            return res.status(404).json({
                message: "Purchase Order not found"
            });
        }

        res.status(200).json({
            purchaseOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching Purchase Order",
            error: error.message
        });
    }
};


const updatePurchaseOrder = async (req, res) => {
    try {
        const { quantity, supplierName, status } = req.body;

        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            {
                quantity,
                supplierName,
                status
            },
            { new: true }
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                message: "Purchase Order not found"
            });
        }

        res.status(200).json({
            message: "Purchase Order updated successfully!",
            purchaseOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating Purchase Order",
            error: error.message
        });
    }
};


const deletePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndDelete(
            req.params.id
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                message: "Purchase Order not found"
            });
        }

        res.status(200).json({
            message: "Purchase Order deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting Purchase Order",
            error: error.message
        });
    }
};


module.exports = {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder
};