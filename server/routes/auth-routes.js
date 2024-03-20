'use strict';

const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// These are all the server routes needed for logging users in and out of the application.
router.get('/login', authController.login);
router.get('/callback', authController.authCallback);
router.get('/logout', authController.logout);

// This is the first endpoint React calls when mounted in the browser to determine if the user is authenticated.
router.get('/auth-state', authController.authState);

module.exports = router;
