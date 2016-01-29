'use strict';

let express = require('express');
let passport = require('passport');
let config = require('../config/environment');
let User = require('../database').User;

// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/google', require('./google'));

module.exports = router;