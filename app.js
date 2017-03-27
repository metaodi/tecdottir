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
        url: "http://" + swaggerDocument.host + "/swagger"
    };
    var customCss = '#header { display: none }';
    app.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocument, false, options, customCss));
    
    //redirect to https
    app.use(function(req, res, next) {
        console.log(req.get('Host'));
        if (!req.secure && req.get('Host') != 'localhost:10010') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    });
   
    //redirect root to /docs
    app.get('/', function (req, res) {
        res.redirect('/docs')
    })
  
  
    var port = process.env.PORT || 10010;
    app.listen(port);
  
    console.log('try this:\ncurl http://' + swaggerDocument.host + '/measurements');
});
