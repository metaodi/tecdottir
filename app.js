'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-ui-express');
var app = require('express')();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);


  // add swagger ui
  var options = {
      docExpansion: "full"
  };
  var customCss = '#header { display: none }';
  app.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerExpress.runner.swagger, false, options, customCss));
 
  //redirect root to /docs
  app.get('/', function (req, res) {
    res.redirect('/docs')
  })

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
