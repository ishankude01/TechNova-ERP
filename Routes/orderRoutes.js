const express = require("express");

const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../Controllers/order");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, getOrders);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id", authMiddleware, updateOrder);
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteOrder
);


module.exports = router;