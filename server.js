require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const grnRoutes = require("./Routes/grnRoutes");
const purchaseOrderRoutes = require("./Routes/purchaseOrderRoutes");
const salesOrderRoutes = require("./Routes/salesOrderRoutes");
const invoiceRoutes = require("./Routes/invoiceRoutes");
const reportsRoutes = require("./Routes/reportsRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const supplierRoutes = require("./Routes/supplierRoutes");
const errorMiddleware = require("./Middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/grn", grnRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.get("/api-docs/swagger.json", (req, res) => {
    res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: "/api-docs/swagger.json"
    }
}));
app.use(errorMiddleware);

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.get("/", (req, res) => {
  res.send("ERP Management System is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});