const Customer = require("../Models/customer");

const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const customer = new Customer({
            name,
            email,
            phone,
            address
        });

        await customer.save();

        res.status(201).json({
            message: "Customer created successfully!",
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating customer",
            error: error.message
        });
    }
};


const getCustomers = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many customers to skip
        const skip = (page - 1) * limit;

        // Search text
        const search = req.query.search || "";

        // Search by customer name or email
        const searchFilter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        // Get customers
        const customers = await Customer.find(searchFilter)
            .skip(skip)
            .limit(limit);

        // Count matching customers
        const totalCustomers = await Customer.countDocuments(searchFilter);

        res.status(200).json({
            customers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCustomers / limit),
                totalCustomers,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching customers",
            error: error.message
        });
    }
};


const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching customer",
            error: error.message
        });
    }
};


const updateCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                address
            },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer updated successfully!",
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating customer",
            error: error.message
        });
    }
};


const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting customer",
            error: error.message
        });
    }
};


module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};