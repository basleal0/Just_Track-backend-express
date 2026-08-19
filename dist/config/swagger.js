import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "JustTrack API Documentation",
            version: "1.0.0",
            description: "Interactive API documentation and endpoint testing for JustTrack backend.",
        },
        servers: [
            {
                url: "https://just-track-backend-bw9u.onrender.com",
                description: "Production Server (Render)",
            },
            {
                url: "http://localhost:3000",
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                    description: "HTTP-Only cookie set automatically upon successful login",
                },
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    },
    apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
//# sourceMappingURL=swagger.js.map