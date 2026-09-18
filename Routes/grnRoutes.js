const express = require("express");

const grnValidation = require("../Validation/grnValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const router = express.Router();

const {
    createGRN,
    getGRNs,
    getGRNById,
    updateGRN,
    deleteGRN
} = require("../Controllers/grn");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/grn:
 *   post:
 *     summary: Create a new GRN
 *     description: Create a Goods Received Note linked to a purchase order. Admin access required.
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
 *               - purchaseOrderId
 *               - quantity
 *               - supplierName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               purchaseOrderId:
 *                 type: string
 *                 example: 6a9c63ae0868bf577fd8b9aa
 *               quantity:
 *                 type: integer
 *                 example: 40
 *               supplierName:
 *                 type: string
 *                 example: ABC Electronics
 *               status:
 *                 type: string
 *                 example: Received
 *     responses:
 *       201:
 *         description: GRN created successfully
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
    validationMiddleware(grnValidation),
    createGRN
);


/**
 * @swagger
 * /api/grn:
 *   get:
 *     summary: Get all GRNs
 *     description: Get all Goods Received Notes with pagination and search filtering
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
 *         description: Number of GRNs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by supplier name or status
 *     responses:
 *       200:
 *         description: GRNs fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authMiddleware,
    getGRNs
);


/**
 * @swagger
 * /api/grn/{id}:
 *   get:
 *     summary: Get GRN by ID
 *     description: Get a single Goods Received Note using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GRN ID
 *         example: 6a9c66520868bf577fd8b9ab
 *     responses:
 *       200:
 *         description: GRN fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: GRN not found
 */
router.get(
    "/:id",
    authMiddleware,
    getGRNById
);


/**
 * @swagger
 * /api/grn/{id}:
 *   put:
 *     summary: Update a GRN
 *     description: Update an existing Goods Received Note. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GRN ID
 *         example: 6a9c66520868bf577fd8b9ab
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - purchaseOrderId
 *               - quantity
 *               - supplierName
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a953daca76f21f182cacc0e
 *               purchaseOrderId:
 *                 type: string
 *                 example: 6a9c63ae0868bf577fd8b9aa
 *               quantity:
 *                 type: integer
 *                 example: 40
 *               supplierName:
 *                 type: string
 *                 example: ABC Electronics
 *               status:
 *                 type: string
 *                 example: Received
 *     responses:
 *       200:
 *         description: GRN updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: GRN not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(grnValidation),
    updateGRN
);


/**
 * @swagger
 * /api/grn/{id}:
 *   delete:
 *     summary: Delete a GRN
 *     description: Delete an existing Goods Received Note. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GRN ID
 *         example: 6a9c66520868bf577fd8b9ab
 *     responses:
 *       200:
 *         description: GRN deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: GRN not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteGRN
);


module.exports = router;