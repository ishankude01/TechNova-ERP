const express = require("express");

const invoiceValidation = require("../Validation/invoiceValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const router = express.Router();

const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    generateInvoicePDF
} = require("../Controllers/invoice");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     description: Create an invoice linked to a sales order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salesOrderId
 *               - productId
 *               - quantity
 *               - customerName
 *               - amount
 *             properties:
 *               salesOrderId:
 *                 type: string
 *                 example: 6a9c74c693d2f8b984384fe4
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               customerName:
 *                 type: string
 *                 example: XYZ Customer
 *               amount:
 *                 type: number
 *                 example: 120000
 *               status:
 *                 type: string
 *                 enum:
 *                   - Unpaid
 *                   - Paid
 *                   - Cancelled
 *                 example: Unpaid
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(invoiceValidation),
    createInvoice
);


/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     description: Get invoices with pagination and search filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of invoices per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name or invoice status
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authMiddleware,
    getInvoices
);


/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     description: Get a single invoice using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *         example: 6a9c712e93d2f8b984384fe3
 *     responses:
 *       200:
 *         description: Invoice fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invoice not found
 */
router.get(
    "/:id",
    authMiddleware,
    getInvoiceById
);


/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     description: Update an existing invoice. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *         example: 6a9c712e93d2f8b984384fe3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salesOrderId
 *               - productId
 *               - quantity
 *               - customerName
 *               - amount
 *             properties:
 *               salesOrderId:
 *                 type: string
 *                 example: 6a9c74c693d2f8b984384fe4
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               customerName:
 *                 type: string
 *                 example: XYZ Customer
 *               amount:
 *                 type: number
 *                 example: 120000
 *               status:
 *                 type: string
 *                 enum:
 *                   - Unpaid
 *                   - Paid
 *                   - Cancelled
 *                 example: Paid
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Invoice not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(invoiceValidation),
    updateInvoice
);


/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     description: Delete an existing invoice. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *         example: 6a9c712e93d2f8b984384fe3
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Invoice not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteInvoice
);


/**
 * @swagger
 * /api/invoices/{id}/pdf:
 *   get:
 *     summary: Generate invoice PDF
 *     description: Generate and download a PDF for an existing invoice.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *         example: 6a9c712e93d2f8b984384fe3
 *     responses:
 *       200:
 *         description: Invoice PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invoice not found
 */
router.get(
    "/:id/pdf",
    authMiddleware,
    generateInvoicePDF
);


module.exports = router;