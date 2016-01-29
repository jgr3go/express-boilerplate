/**
 * Sequelize initialization module
 */

'use strict';

let path = require('path');
let config = require('../config/environment');
let Sequelize = require('sequelize');

let sq = config.sequelize;

let db = {
  Sequelize,
  sequelize: new Sequelize(
      sq.database, 
      sq.user, 
      sq.password,
      sq.options)
};

// Insert models below
db.User = db.sequelize.import('../api/user/user.model');

module.exports = db;
