'use strict';

let Router = require('express').Router;
let controller = require('./user.controller');
let auth = require('../../auth/auth.service');

var router = new Router();

router.get('/', auth.isAdmin(), controller.index);
router.delete('/:id', auth.isAdmin(), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
