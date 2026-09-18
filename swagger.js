const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "ERP Management System API",
        version: "1.0.0",
        description: "REST API documentation for ERP Management System"
    },

    servers: [
        {
            url: "http://localhost:5000"
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ["./Routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;