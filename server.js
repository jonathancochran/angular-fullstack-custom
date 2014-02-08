'use strict';

// Module dependencies.
var express = require('express'),  
    path = require('path'),
    fs = require('fs');

var app = express();
var env = app.get('env');

// env specific property file
var props = require('./lib/config/properties/properties')(env);

// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with dummy data
require('./lib/db/dummydata');


// Express Configuration
require('./lib/config/express')(app);

// Controllers
var api = require('./lib/controllers/api'),
    index = require('./lib/controllers');

// Server Routes
app.get('/api/awesomeThings', api.awesomeThings);

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/*', index.index);

// dev
if(env === 'development'){
    console.log('Dev environment specific tasks loaded');
}

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, env);
});

// Expose app
exports = module.exports = app;