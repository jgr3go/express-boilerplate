'use strict';

let express = require('express');
let passport = require('passport');
let authSvc = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = authSvc.signToken(user._id);
    res.json({ token });
  })(req, res, next);
});

module.exports = router;
