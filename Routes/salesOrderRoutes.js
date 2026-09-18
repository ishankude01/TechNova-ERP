const express = require("express");

const router = express.Router();

const salesOrderValidation = require("../Validation/salesOrderValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder
} = require("../Controllers/salesOrder");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/sales-orders:
 *   post:
 *     summary: Create a new sales order
 *     description: Create a sales order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - customerName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               customerName:
 *                 type: string
 *                 example: XYZ Customer
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Delivered, Cancelled]
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Sales order created successfully
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
    validationMiddleware(salesOrderValidation),
    createSalesOrder
);


/**
 * @swagger
 * /api/sales-orders:
 *   get:
 *     summary: Get all sales orders
 *     description: Get sales orders with pagination and search filtering
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
 *         description: Number of sales orders per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name or status
 *     responses:
 *       200:
 *         description: Sales orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authMiddleware,
    getSalesOrders
);


/**
 * @swagger
 * /api/sales-orders/{id}:
 *   get:
 *     summary: Get sales order by ID
 *     description: Get a single sales order using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales Order ID
 *         example: 6a9c6e3c188c1912f48c0847
 *     responses:
 *       200:
 *         description: Sales order fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sales order not found
 */
router.get(
    "/:id",
    authMiddleware,
    getSalesOrderById
);


/**
 * @swagger
 * /api/sales-orders/{id}:
 *   put:
 *     summary: Update a sales order
 *     description: Update an existing sales order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales Order ID
 *         example: 6a9c6e3c188c1912f48c0847
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - customerName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               customerName:
 *                 type: string
 *                 example: XYZ Customer
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Delivered, Cancelled]
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Sales order updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Sales order not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(salesOrderValidation),
    updateSalesOrder
);


/**
 * @swagger
 * /api/sales-orders/{id}:
 *   delete:
 *     summary: Delete a sales order
 *     description: Delete an existing sales order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales Order ID
 *         example: 6a9c6e3c188c1912f48c0847
 *     responses:
 *       200:
 *         description: Sales order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Sales order not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteSalesOrder
);


module.exports = router;