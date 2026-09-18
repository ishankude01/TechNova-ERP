const express = require("express");

const router = express.Router();

const supplierValidation = require("../Validation/supplierValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../Controllers/supplier");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     description: Create a supplier. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: ABC Electronics
 *               email:
 *                 type: string
 *                 example: abc@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Mumbai
 *     responses:
 *       201:
 *         description: Supplier created successfully
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
    validationMiddleware(supplierValidation),
    createSupplier
);


/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     description: Get suppliers with pagination and search filtering
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
 *         description: Number of suppliers per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by supplier name or email
 *     responses:
 *       200:
 *         description: Suppliers fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getSuppliers);


/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     description: Get a single supplier using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *         example: 6a9f0f3bd599b1774f87dc25
 *     responses:
 *       200:
 *         description: Supplier fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Supplier not found
 */
router.get("/:id", authMiddleware, getSupplierById);


/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     description: Update an existing supplier. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *         example: 6a9f0f3bd599b1774f87dc25
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: ABC Electronics Updated
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543211"
 *               address:
 *                 type: string
 *                 example: Pune
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Supplier not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(supplierValidation),
    updateSupplier
);


/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     description: Delete an existing supplier. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *         example: 6a9f0f3bd599b1774f87dc25
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Supplier not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteSupplier
);


module.exports = router;