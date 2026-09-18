const SalesOrder = require("../Models/salesOrder");
const PurchaseOrder = require("../Models/purchaseOrder");
const Invoice = require("../Models/invoice");
const Product = require("../Models/product");

const getReports = async (req, res) => {
    try {
        // Sales Summary
        const totalSalesOrders = await SalesOrder.countDocuments();

        const salesData = await SalesOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        const totalSalesQuantity =
            salesData.length > 0 ? salesData[0].totalQuantity : 0;


        // Purchase Summary
        const totalPurchaseOrders = await PurchaseOrder.countDocuments();

        const purchaseData = await PurchaseOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        const totalPurchaseQuantity =
            purchaseData.length > 0 ? purchaseData[0].totalQuantity : 0;


        // Invoice Summary
        const totalInvoices = await Invoice.countDocuments();

        const invoiceData = await Invoice.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalInvoiceAmount =
            invoiceData.length > 0 ? invoiceData[0].totalAmount : 0;


        // Inventory Summary
        const totalProducts = await Product.countDocuments();

        const productData = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$quantity" }
                }
            }
        ]);

        const totalStock =
            productData.length > 0 ? productData[0].totalStock : 0;


        res.status(200).json({
            message: "Reports generated successfully!",

            salesSummary: {
                totalSalesOrders,
                totalSalesQuantity
            },

            purchaseSummary: {
                totalPurchaseOrders,
                totalPurchaseQuantity
            },

            invoiceSummary: {
                totalInvoices,
                totalInvoiceAmount
            },

            inventorySummary: {
                totalProducts,
                totalStock
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generating reports",
            error: error.message
        });
    }
};

module.exports = {
    getReports
};