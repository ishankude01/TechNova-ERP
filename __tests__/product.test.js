require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");

const BASE_URL = "http://localhost:5000";

const token = jwt.sign(
    {
        id: "test-admin-id",
        role: "admin"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

const userToken = jwt.sign(
    {
        id: "test-user-id",
        role: "user"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

const productId = "6a953daca76f21f182cacc0e";
const purchaseOrderId = "6a9c63ae0868bf577fd8b9aa";
const salesOrderId = "6a9c74c693d2f8b984384fe4";

let createdProductId;
let createdCustomerId;
let createdSupplierId;
let createdSalesOrderId;
let createdPurchaseOrderId;
let createdGrnId;
let createdInvoiceId;


// ==================== PRODUCT API ====================

describe("Product API", () => {

    test("GET /api/products should return products", async () => {
        const response = await request(BASE_URL)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("products");
        expect(Array.isArray(response.body.products)).toBe(true);
    });

    test("GET /api/products without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/products");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/products should create a product", async () => {
        const response = await request(BASE_URL)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Test Product",
                price: 1500,
                quantity: 10,
                category: "Testing"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("product");
        expect(response.body.product.name).toBe("Jest Test Product");

        createdProductId = response.body.product._id;
    });

    test("PUT /api/products/:id should update a product", async () => {
        const response = await request(BASE_URL)
            .put(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Updated Product",
                price: 2000,
                quantity: 20,
                category: "Testing"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("product");
        expect(response.body.product.name).toBe("Jest Updated Product");
    });

    test("DELETE /api/products/:id should delete a product", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== CUSTOMER API ====================

describe("Customer API", () => {

    test("GET /api/customers should return customers", async () => {
        const response = await request(BASE_URL)
            .get("/api/customers")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("customers");
        expect(Array.isArray(response.body.customers)).toBe(true);
    });

    test("GET /api/customers without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/customers");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/customers should create a customer", async () => {
        const response = await request(BASE_URL)
            .post("/api/customers")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Test Customer",
                email: "jestcustomer@gmail.com",
                phone: "9876543210",
                address: "Pune"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("customer");
        expect(response.body.customer.name).toBe("Jest Test Customer");

        createdCustomerId = response.body.customer._id;
    });

    test("PUT /api/customers/:id should update a customer", async () => {
        const response = await request(BASE_URL)
            .put(`/api/customers/${createdCustomerId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Updated Customer",
                email: "jestupdated@gmail.com",
                phone: "9876543211",
                address: "Mumbai"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("customer");
        expect(response.body.customer.name).toBe("Jest Updated Customer");
    });

    test("DELETE /api/customers/:id should delete a customer", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/customers/${createdCustomerId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== SUPPLIER API ====================

describe("Supplier API", () => {

    test("GET /api/suppliers should return suppliers", async () => {
        const response = await request(BASE_URL)
            .get("/api/suppliers")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("suppliers");
        expect(Array.isArray(response.body.suppliers)).toBe(true);
    });

    test("GET /api/suppliers without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/suppliers");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/suppliers should create a supplier", async () => {
        const response = await request(BASE_URL)
            .post("/api/suppliers")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Test Supplier",
                email: "jestsupplier@gmail.com",
                phone: "9876543210",
                address: "Pune"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("supplier");
        expect(response.body.supplier.name).toBe("Jest Test Supplier");

        createdSupplierId = response.body.supplier._id;
    });

    test("PUT /api/suppliers/:id should update a supplier", async () => {
        const response = await request(BASE_URL)
            .put(`/api/suppliers/${createdSupplierId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jest Updated Supplier",
                email: "jestupdatedsupplier@gmail.com",
                phone: "9876543211",
                address: "Mumbai"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("supplier");
        expect(response.body.supplier.name).toBe("Jest Updated Supplier");
    });

    test("DELETE /api/suppliers/:id should delete a supplier", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/suppliers/${createdSupplierId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== SALES ORDER API ====================

describe("Sales Order API", () => {

    test("GET /api/sales-orders should return sales orders", async () => {
        const response = await request(BASE_URL)
            .get("/api/sales-orders")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("salesOrders");
        expect(Array.isArray(response.body.salesOrders)).toBe(true);
    });

    test("GET /api/sales-orders without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/sales-orders");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/sales-orders should create a sales order", async () => {
        const response = await request(BASE_URL)
            .post("/api/sales-orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 2,
                customerName: "Jest Test Customer",
                status: "Pending"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("salesOrder");
        expect(response.body.salesOrder.customerName).toBe("Jest Test Customer");

        createdSalesOrderId = response.body.salesOrder._id;
    });

    test("PUT /api/sales-orders/:id should update a sales order", async () => {
        const response = await request(BASE_URL)
            .put(`/api/sales-orders/${createdSalesOrderId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 3,
                customerName: "Jest Updated Customer",
                status: "Approved"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("salesOrder");
        expect(response.body.salesOrder.customerName).toBe("Jest Updated Customer");
    });

    test("DELETE /api/sales-orders/:id should delete a sales order", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/sales-orders/${createdSalesOrderId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== PURCHASE ORDER API ====================

describe("Purchase Order API", () => {

    test("GET /api/purchase-orders should return purchase orders", async () => {
        const response = await request(BASE_URL)
            .get("/api/purchase-orders")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("purchaseOrders");
        expect(Array.isArray(response.body.purchaseOrders)).toBe(true);
    });

    test("GET /api/purchase-orders without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/purchase-orders");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/purchase-orders should create a purchase order", async () => {
        const response = await request(BASE_URL)
            .post("/api/purchase-orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 5,
                supplierName: "Jest Test Supplier",
                status: "Pending"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("purchaseOrder");
        expect(response.body.purchaseOrder.supplierName).toBe("Jest Test Supplier");

        createdPurchaseOrderId = response.body.purchaseOrder._id;
    });

    test("PUT /api/purchase-orders/:id should update a purchase order", async () => {
        const response = await request(BASE_URL)
            .put(`/api/purchase-orders/${createdPurchaseOrderId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 10,
                supplierName: "Jest Updated Supplier",
                status: "Approved"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("purchaseOrder");
        expect(response.body.purchaseOrder.supplierName).toBe("Jest Updated Supplier");
    });

    test("DELETE /api/purchase-orders/:id should delete a purchase order", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/purchase-orders/${createdPurchaseOrderId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== GRN API ====================

describe("GRN API", () => {

    test("GET /api/grn should return GRNs", async () => {
        const response = await request(BASE_URL)
            .get("/api/grn")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("grns");
        expect(Array.isArray(response.body.grns)).toBe(true);
    });

    test("GET /api/grn without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/grn");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/grn should create a GRN", async () => {
        const response = await request(BASE_URL)
            .post("/api/grn")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                purchaseOrderId: purchaseOrderId,
                quantity: 1,
                supplierName: "Jest Test Supplier",
                status: "Received"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("grn");
        expect(response.body.grn.supplierName).toBe("Jest Test Supplier");

        createdGrnId = response.body.grn._id;
    });

    test("PUT /api/grn/:id should update a GRN", async () => {
        const response = await request(BASE_URL)
            .put(`/api/grn/${createdGrnId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                purchaseOrderId: purchaseOrderId,
                quantity: 2,
                supplierName: "Jest Updated Supplier",
                status: "Received"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("grn");
        expect(response.body.grn.supplierName).toBe("Jest Updated Supplier");
    });

    test("DELETE /api/grn/:id should delete a GRN", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/grn/${createdGrnId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== INVOICE API ====================

describe("Invoice API", () => {

    test("GET /api/invoices should return invoices", async () => {
        const response = await request(BASE_URL)
            .get("/api/invoices")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("invoices");
        expect(Array.isArray(response.body.invoices)).toBe(true);
    });

    test("GET /api/invoices without token should return 401", async () => {
        const response = await request(BASE_URL)
            .get("/api/invoices");

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/invoices should create an invoice", async () => {
        const response = await request(BASE_URL)
            .post("/api/invoices")
            .set("Authorization", `Bearer ${token}`)
            .send({
                salesOrderId: salesOrderId,
                productId: productId,
                quantity: 1,
                customerName: "Jest Test Customer",
                amount: 60000,
                status: "Unpaid"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("invoice");
        expect(response.body.invoice.customerName).toBe("Jest Test Customer");

        createdInvoiceId = response.body.invoice._id;
    });

    test("PUT /api/invoices/:id should update an invoice", async () => {
        const response = await request(BASE_URL)
            .put(`/api/invoices/${createdInvoiceId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                salesOrderId: salesOrderId,
                productId: productId,
                quantity: 2,
                customerName: "Jest Updated Customer",
                amount: 120000,
                status: "Paid"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("invoice");
        expect(response.body.invoice.customerName).toBe("Jest Updated Customer");
    });

    test("DELETE /api/invoices/:id should delete an invoice", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/invoices/${createdInvoiceId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

});


// ==================== AUTHENTICATION & AUTHORIZATION ====================

describe("Authentication & Authorization", () => {

    test("Protected route should work with valid admin token", async () => {
        const response = await request(BASE_URL)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

    test("Protected route should reject missing token", async () => {
        const response = await request(BASE_URL)
            .get("/api/products");

        expect(response.statusCode).toBe(401);
    });

    test("Protected route should reject invalid token", async () => {
        const response = await request(BASE_URL)
            .get("/api/products")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);
    });

    test("Admin-only route should reject normal user role", async () => {
        const response = await request(BASE_URL)
            .post("/api/products")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                name: "Unauthorized Test Product",
                price: 1000,
                quantity: 5,
                category: "Testing"
            });

        expect(response.statusCode).toBe(403);
    });

});