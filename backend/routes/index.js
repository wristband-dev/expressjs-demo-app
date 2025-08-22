'use strict';

const express = require('express');

const apiV1Routes = require('./v1');
const authController = require('../controllers/auth-controller');

const router = express.Router();

/**
 * All public auth APIs that are called from an unauthenticated state.
 */
router.get('/auth/login', authController.login);
router.get('/auth/callback', authController.authCallback);
router.get('/auth/logout', authController.logout);

/**
 * Routes that will be protected EITHER by the session cookie OR by an access token.
 */
router.use('/v1', apiV1Routes);

module.exports = router;
