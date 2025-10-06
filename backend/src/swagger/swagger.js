import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Polling System API",
      version: "1.0.0",
      description: "API documentation for the Polling System with voter authorization",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server"
      }
    ],
    tags: [
      {
        name: "Users",
        description: "User management endpoints"
      },
      {
        name: "Polls",
        description: "Poll management endpoints"
      },
      {
        name: "Choices",
        description: "Poll choice endpoints"
      },
      {
        name: "Votes",
        description: "Voting endpoints"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Polling System API Docs"
  }));
  
  console.log("Swagger documentation available at http://localhost:5000/api-docs");
};