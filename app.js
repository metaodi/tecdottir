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
        url: "https://" + swaggerDocument.host + "/swagger"
    };
    var customCss = '#header { display: none }';
    app.use('/docs', SwaggerUi.serve, function (req, res) {
        // override config for localhost
        if (req.get('Host').includes('localhost')) {
            swaggerDocument.host = 'localhost:10010';
            swaggerDocument.schemes = ['http'];
            options.url = 'http://localhost:10010/swagger';
        }
        var handler = SwaggerUi.setup(swaggerDocument, false, options, customCss);
        handler(req, res);
    });
    
    //redirect root to /docs
    app.get('/', function (req, res) {
        res.redirect('/docs')
    })
  
  
    var port = process.env.PORT || 10010;
    app.listen(port);
});
