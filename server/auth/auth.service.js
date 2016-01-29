'use strict';

let passport = require('passport');
let config = require('../config/environment');
let jwt = require('jsonwebtoken');
let expressJwt = require('express-jwt');
let compose = require('composable-middleware');
let User = require('../database').User;

let validateJwt = expressJwt({
  secret: config.secrets.session
});

module.exports = {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    signToken: signToken,
    setTokenCookie: setTokenCookie
};

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
        User.find({
            where: {
                id: req.user.id
            }
        })
        .then(user => {
          if (!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function isAdmin () {
    return compose()
        .use(isAuthenticated())
        .use(function checkAdmin(req, res, next) {
            if (req.user.is_admin) {
                return next();
            } else {
                res.status(403).send("Forbidden");
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(401).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
