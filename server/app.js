/**
 * Main application file
 */

'use strict';

let express = require('express');
let db = require('./database');
let config = require('./config/environment');
let http = require('http');

// Setup server
var app = express();
var server = http.createServer(app);

require('./express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

db.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;
