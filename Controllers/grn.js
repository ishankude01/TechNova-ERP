const GRN = require("../Models/grn");
const PurchaseOrder = require("../Models/purchaseOrder");

const createGRN = async (req, res) => {
    try {
        const { productId, purchaseOrderId, quantity, supplierName } = req.body;

        const grn = new GRN({
            productId,
            purchaseOrderId,
            quantity,
            supplierName
        });

        await grn.save();

        await PurchaseOrder.findByIdAndUpdate(
            purchaseOrderId,
            { status: "Received" },
            { new: true }
        );

        res.status(201).json({
            message: "GRN created successfully!",
            grn
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating GRN",
            error: error.message
        });
    }
};


const getGRNs = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many GRNs to skip
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

        // Get GRNs
        const grns = await GRN.find(searchFilter)
            .populate("purchaseOrderId")
            .populate("productId")
            .skip(skip)
            .limit(limit);

        // Count matching GRNs
        const totalGRNs = await GRN.countDocuments(searchFilter);

        res.status(200).json({
            grns,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalGRNs / limit),
                totalGRNs,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching GRNs",
            error: error.message
        });
    }
};

const getGRNById = async (req, res) => {
    try {
        const grn = await GRN.findById(req.params.id)
            .populate("purchaseOrderId")
            .populate("productId");

        if (!grn) {
            return res.status(404).json({
                message: "GRN not found"
            });
        }

        res.status(200).json({
            grn
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching GRN",
            error: error.message
        });
    }
};


const updateGRN = async (req, res) => {
    try {
        const { quantity, supplierName, status } = req.body;

        const grn = await GRN.findByIdAndUpdate(
            req.params.id,
            {
                quantity,
                supplierName,
                status
            },
            { new: true }
        );

        if (!grn) {
            return res.status(404).json({
                message: "GRN not found"
            });
        }

        res.status(200).json({
            message: "GRN updated successfully!",
            grn
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating GRN",
            error: error.message
        });
    }
};


const deleteGRN = async (req, res) => {
    try {
        const grn = await GRN.findByIdAndDelete(req.params.id);

        if (!grn) {
            return res.status(404).json({
                message: "GRN not found"
            });
        }

        res.status(200).json({
            message: "GRN deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting GRN",
            error: error.message
        });
    }
};


module.exports = {
    createGRN,
    getGRNs,
    getGRNById,
    updateGRN,
    deleteGRN
};