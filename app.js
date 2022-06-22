'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-ui-express');
var app = require('express')();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) {
        throw err;
    }
  
    // install middleware
    swaggerExpress.register(app);
  
    // add swagger ui
    var swaggerDocument = swaggerExpress.runner.swagger;
    var options = {
        docExpansion: "full",
        tryItOutEnabled: true,
        syntaxHighlight: false,
        url: "https://" + swaggerDocument.host + "/swagger"
    };
    var customCss = '#header { display: none }';
    var port = process.env.PORT || 10010;
    app.use('/docs', SwaggerUi.serve, function (req, res) {
        // override config for localhost
        if (req.get('Host').includes('localhost')) {
            swaggerDocument.host = `localhost:${port}`;
            swaggerDocument.schemes = ['http'];
            options.url = `http://localhost:${port}/swagger`;
        }
        var handler = SwaggerUi.setup(swaggerDocument, false, options, customCss);
        handler(req, res);
    });
    
    //redirect root to /docs
    app.get('/', function (req, res) {
        res.redirect('/docs')
    })
  
    //this is needed to avoid EADDRINUSE errors
    //see http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
    if(!module.parent) {
        app.listen(port);
    }
});
