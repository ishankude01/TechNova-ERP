const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully!",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            "ERP_SECRET_KEY",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful!",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};


// PASTE resetAdminPassword HERE
const resetAdminPassword = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const user = await User.findOneAndUpdate(
            { email: "ishan@example.com" },
            {
                password: hashedPassword,
                role: "admin"
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "Admin user not found"
            });
        }

        res.status(200).json({
            message: "Admin password reset successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error resetting password",
            error: error.message
        });
    }
};




module.exports = { registerUser, loginUser, resetAdminPassword };