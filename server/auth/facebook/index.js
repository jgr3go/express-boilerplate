'use strict';

let express = require('express');
let passport = require('passport');
let setTokenCookie = require('../auth.service').setTokenCookie;

var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

module.exports = router;
