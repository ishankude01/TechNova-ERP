const Supplier = require("../Models/supplier");

const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const supplier = new Supplier({
            name,
            email,
            phone,
            address
        });

        await supplier.save();

        res.status(201).json({
            message: "Supplier created successfully!",
            supplier
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating supplier",
            error: error.message
        });
    }
};


const getSuppliers = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many suppliers to skip
        const skip = (page - 1) * limit;

        // Search text
        const search = req.query.search || "";

        // Search by supplier name or email
        const searchFilter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        // Get suppliers
        const suppliers = await Supplier.find(searchFilter)
            .skip(skip)
            .limit(limit);

        // Count matching suppliers
        const totalSuppliers = await Supplier.countDocuments(searchFilter);

        res.status(200).json({
            suppliers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalSuppliers / limit),
                totalSuppliers,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching suppliers",
            error: error.message
        });
    }
};


const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            supplier
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching supplier",
            error: error.message
        });
    }
};


const updateSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                address
            },
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            message: "Supplier updated successfully!",
            supplier
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating supplier",
            error: error.message
        });
    }
};


const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            message: "Supplier deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting supplier",
            error: error.message
        });
    }
};


module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};