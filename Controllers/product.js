const Product = require("../Models/product");

const createProduct = async (req, res) => {
    try {
        const { name, price, quantity, category } = req.body;

        const product = new Product({
            name,
            price,
            quantity,
            category
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully!",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many products to skip
        const skip = (page - 1) * limit;

        // Search text
        const search = req.query.search || "";

        // Search by product name or category
        const searchFilter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { category: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        // Get products
        const products = await Product.find(searchFilter)
            .skip(skip)
            .limit(limit);

        // Count matching products
        const totalProducts = await Product.countDocuments(searchFilter);

        res.status(200).json({
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: error.message
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching product",
            error: error.message
        });
    }
};



const updateProduct = async (req, res) => {
    try {
        const { name, price, quantity, category } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, quantity, category },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
};
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };