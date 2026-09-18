const express = require("express");

const purchaseOrderValidation = require("../Validation/purchaseOrderValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const router = express.Router();

const {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder
} = require("../Controllers/purchaseOrder");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     description: Create a purchase order. Admin access required.
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
 *               - supplierName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               supplierName:
 *                 type: string
 *                 example: ABC Electronics
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Received, Cancelled]
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Purchase order created successfully
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
    validationMiddleware(purchaseOrderValidation),
    createPurchaseOrder
);


/**
 * @swagger
 * /api/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     description: Get purchase orders with pagination and search filtering
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
 *         description: Number of purchase orders per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by supplier name or status
 *     responses:
 *       200:
 *         description: Purchase orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authMiddleware,
    getPurchaseOrders
);


/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   get:
 *     summary: Get purchase order by ID
 *     description: Get a single purchase order using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *         example: 6a9c63ae0868bf577fd8b9aa
 *     responses:
 *       200:
 *         description: Purchase order fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Purchase order not found
 */
router.get(
    "/:id",
    authMiddleware,
    getPurchaseOrderById
);


/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   put:
 *     summary: Update a purchase order
 *     description: Update an existing purchase order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *         example: 6a9c63ae0868bf577fd8b9aa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - supplierName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               quantity:
 *                 type: integer
 *                 example: 20
 *               supplierName:
 *                 type: string
 *                 example: ABC Electronics
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Received, Cancelled]
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Purchase order not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(purchaseOrderValidation),
    updatePurchaseOrder
);


/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   delete:
 *     summary: Delete a purchase order
 *     description: Delete an existing purchase order. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *         example: 6a9c63ae0868bf577fd8b9aa
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Purchase order not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deletePurchaseOrder
);


module.exports = router;