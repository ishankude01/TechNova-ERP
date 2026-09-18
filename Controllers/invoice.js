const Invoice = require("../Models/invoice");
const Product = require("../Models/product");
const PDFDocument = require("pdfkit");


// ==================================================
// CREATE INVOICE
// ==================================================

const createInvoice = async (req, res) => {
    try {
        const {
            salesOrderId,
            productId,
            quantity,
            customerName
        } = req.body;

        // Find product to get current price
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Automatically calculate amount
        const amount = product.price * quantity;

        const invoice = new Invoice({
            salesOrderId,
            productId,
            quantity,
            customerName,
            amount
        });

        await invoice.save();

        res.status(201).json({
            message: "Invoice created successfully!",
            invoice
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating invoice",
            error: error.message
        });
    }
};


// ==================================================
// GET ALL INVOICES
// ==================================================

const getInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const search = req.query.search || "";

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

        const invoices = await Invoice.find(searchFilter)
            .populate("salesOrderId")
            .populate("productId")
            .skip(skip)
            .limit(limit);

        const totalInvoices =
            await Invoice.countDocuments(searchFilter);

        res.status(200).json({
            invoices,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(
                    totalInvoices / limit
                ),
                totalInvoices,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching invoices",
            error: error.message
        });
    }
};


// ==================================================
// GET INVOICE BY ID
// ==================================================

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(
            req.params.id
        )
            .populate("salesOrderId")
            .populate("productId");

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            invoice
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching invoice",
            error: error.message
        });
    }
};


// ==================================================
// UPDATE INVOICE
// ==================================================

const updateInvoice = async (req, res) => {
    try {
        const {
            salesOrderId,
            productId,
            quantity,
            customerName,
            status
        } = req.body;

        // Find product to get current price
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Automatically calculate amount
        const amount = product.price * quantity;

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                salesOrderId,
                productId,
                quantity,
                customerName,
                amount,
                status
            },
            {
                new: true
            }
        );

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            message: "Invoice updated successfully!",
            invoice
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating invoice",
            error: error.message
        });
    }
};


// ==================================================
// DELETE INVOICE
// ==================================================

const deleteInvoice = async (req, res) => {
    try {
        const invoice =
            await Invoice.findByIdAndDelete(
                req.params.id
            );

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            message: "Invoice deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting invoice",
            error: error.message
        });
    }
};


// ==================================================
// GENERATE INVOICE PDF
// ==================================================

const generateInvoicePDF = async (req, res) => {
    try {
        const invoice = await Invoice.findById(
            req.params.id
        )
            .populate("salesOrderId")
            .populate("productId");

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        const doc = new PDFDocument({
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename=invoice-${invoice._id}.pdf`
        );

        doc.pipe(res);

        // Format Indian currency
        const formatAmount = (amount) => {
            return new Intl.NumberFormat(
                "en-IN"
            ).format(amount);
        };

        // =========================
        // HEADER
        // =========================

        doc
            .fontSize(24)
            .font("Helvetica-Bold")
            .text(
                "ERP MANAGEMENT SYSTEM",
                {
                    align: "center"
                }
            );

        doc.moveDown(0.5);

        doc
            .fontSize(20)
            .text("INVOICE", {
                align: "center"
            });

        doc.moveDown(2);

        // =========================
        // INVOICE DETAILS
        // =========================

        doc
            .fontSize(11)
            .font("Helvetica");

        doc.text(
            `Invoice ID: ${invoice._id}`
        );

        doc.text(
            `Invoice Date: ${invoice.invoiceDate.toDateString()}`
        );

        doc.moveDown(1.5);

        // =========================
        // CUSTOMER DETAILS
        // =========================

        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text("Customer Details");

        doc.moveDown(0.5);

        doc
            .fontSize(11)
            .font("Helvetica")
            .text(
                `Customer Name: ${invoice.customerName}`
            );

        doc.moveDown(1.5);

        // =========================
        // PRODUCT DETAILS
        // =========================

        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text("Product Details");

        doc.moveDown(0.5);

        doc
            .fontSize(11)
            .font("Helvetica");

        doc.text(
            `Product: ${invoice.productId.name}`
        );

        doc.text(
            `Category: ${invoice.productId.category}`
        );

        doc.text(
            `Quantity: ${invoice.quantity}`
        );

        doc.text(
            `Price per Item: INR ${formatAmount(
                invoice.productId.price
            )}`
        );

        doc.moveDown(1);

        // =========================
        // TOTAL
        // =========================

        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text(
                `Total Amount: INR ${formatAmount(
                    invoice.amount
                )}`,
                {
                    align: "right"
                }
            );

        doc.moveDown(2);

        // =========================
        // PAYMENT STATUS
        // =========================

        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(
                `Payment Status: ${invoice.status}`
            );

        doc.moveDown(3);

        // =========================
        // FOOTER
        // =========================

        doc
            .fontSize(10)
            .font("Helvetica")
            .text(
                "Thank you for your business!",
                {
                    align: "center"
                }
            );

        doc.end();

    } catch (error) {
        res.status(500).json({
            message:
                "Error generating invoice PDF",
            error: error.message
        });
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    generateInvoicePDF
};