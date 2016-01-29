'use strict';

let User = require('../../database').User;
let passport = require('passport');
let config = require('../../config/environment');
let jwt = require('jsonwebtoken');


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function index(req, res) {
  User.findAll({
    attributes: [
      'id',
      'name',
      'email',
      'provider'
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function create(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('user');
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ id: user.id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ 
          token,
          user: user.profile
      });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function show(req, res, next) {
  var userId = req.params.id;

  User.find({
    where: {
        id: userId
        }
    })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function destroy(req, res) {
  User.destroy({ id: req.params.id })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      id: userId
    }
  })
  .then(user => {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save()
        .then(() => {
           res.status(204).end();
        })
        .catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
};

/**
 * Get my info
 */
exports.me = function me(req, res, next) {
  var userId = req.user.id;

  User.find({
    where: {
      id: userId
    },
    attributes: [
      'id',
      'name',
      'email',
      'provider'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
};

/**
 * Authentication callback
 */
exports.authCallback = function authCallback(req, res, next) {
  res.redirect('/');
};
