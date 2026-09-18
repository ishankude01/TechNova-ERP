const express = require("express");

const router = express.Router();

const { getReports } = require("../Controllers/reports");

const authMiddleware = require("../Middleware/authMiddleware");


/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get ERP reports
 *     description: Get summary reports for sales orders, purchase orders, invoices, and products.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getReports);


module.exports = router;