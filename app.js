'use strict';

const express = require('express');
const SwaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const app = express();

module.exports = app; // for testing

// Load OpenAPI specification
const apiSpec = path.join(__dirname, 'api/swagger/swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(apiSpec, 'utf8'));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve OpenAPI spec as JSON
app.get('/swagger', (req, res) => {
    res.json(swaggerDocument);
});

// Redirect root to /docs
app.get('/', function (req, res) {
    res.redirect('/docs')
});

// Serve Swagger UI documentation
const port = process.env.PORT || 10010;
app.use('/docs', SwaggerUi.serve, function (req, res) {
    // override config for localhost
    const docToServe = JSON.parse(JSON.stringify(swaggerDocument)); // clone
    if (req.get('Host').includes('localhost')) {
        docToServe.servers = [{ url: `http://localhost:${port}`, description: 'Local server' }];
    }
    const options = {
        docExpansion: "full",
        tryItOutEnabled: true,
        syntaxHighlight: false
    };
    const customCss = '#header { display: none }';
    const handler = SwaggerUi.setup(docToServe, false, options, customCss);
    handler(req, res);
});

// Install OpenAPI validator middleware
app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: false,
        operationHandlers: false
    })
);

// Load controllers manually
const measurementController = require('./api/controllers/measurement');

// Define routes
app.get('/measurements/:station', measurementController.measurements);
app.get('/stations', measurementController.stations);

// Error handler
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        ok: false,
        message: err.message,
        errors: err.errors
    });
});

// This is needed to avoid EADDRINUSE errors
// see http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if(!module.parent) {
    app.listen(port);
}
