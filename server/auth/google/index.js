'use strict';

let express = require('express');
let passport = require('passport');
let setTokenCookie = require('../auth.service').setTokenCookie;

var router = express.Router();

router
  .get('/', passport.authenticate('google', {
    failureRedirect: '/signup',
    scope: [
      'profile',
      'email'
    ],
    session: false
  }))
  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

module.exports = router;
