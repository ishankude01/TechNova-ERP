const express = require("express");

const router = express.Router();

const customerValidation = require("../Validation/customerValidation");
const validationMiddleware = require("../Middleware/validationMiddleware");

const {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../Controllers/customer");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Create a customer. Admin access required.
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Mumbai
 *     responses:
 *       201:
 *         description: Customer created successfully
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
    validationMiddleware(customerValidation),
    createCustomer
);


/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     description: Get customers with pagination and search filtering
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
 *         description: Number of customers per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name or email
 *     responses:
 *       200:
 *         description: Customers fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getCustomers);


/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     description: Get a single customer using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *         example: 6a9f0f3bd599b1774f87dc25
 *     responses:
 *       200:
 *         description: Customer fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.get("/:id", authMiddleware, getCustomerById);


/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     description: Update an existing customer. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
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
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 example: johnupdated@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543211"
 *               address:
 *                 type: string
 *                 example: Pune
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Customer not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    validationMiddleware(customerValidation),
    updateCustomer
);


/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Delete an existing customer. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *         example: 6a9f0f3bd599b1774f87dc25
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Customer not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteCustomer
);


module.exports = router;