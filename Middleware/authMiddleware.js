require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const actualToken = token.replace("Bearer ", "");

       const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        req.user = decoded;
        console.log("AUTH USER:", decoded);

        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;