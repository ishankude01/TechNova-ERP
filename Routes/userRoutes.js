const express = require("express");

const {
  registerUser,
  loginUser,
  resetAdminPassword,
} = require("../Controllers/user.js");

const User = require("../Models/user.js");

const router = express.Router();

// ======================================================
// GET ALL USERS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// ======================================================
// REGISTER USER
// ======================================================

router.post("/register", registerUser);

// ======================================================
// LOGIN USER
// ======================================================

router.post("/login", loginUser);

// ======================================================
// RESET ADMIN PASSWORD
// ======================================================

router.post(
  "/reset-admin-password",
  resetAdminPassword
);

module.exports = router;