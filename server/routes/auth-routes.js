'use strict';

const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// These are all the server routes needed for logging users in and out of the application.
router.get('/login', authController.login);
router.get('/callback', authController.authCallback);
router.get('/logout', authController.logout);

module.exports = router;
