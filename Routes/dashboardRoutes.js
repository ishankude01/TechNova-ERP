const express = require("express");

const router = express.Router();

const { getDashboard } = require("../Controllers/dashboard");

const authMiddleware = require("../Middleware/authMiddleware");

router.get("/", authMiddleware, getDashboard);

module.exports = router;