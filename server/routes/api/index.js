'use strict';

const express = require('express');
const invotasticRoutes = require('./invotastic-routes');
const sessionRoutes = require('./session-routes');
const wristbandRoutes = require('./wristband-routes');

const router = express.Router();

// All APIs for handling Invotastic-specific resource entities
router.use(invotasticRoutes);

// All APIs for handling any app data tied to a user's Invotastic application session.
router.use(sessionRoutes);

// All APIs for handling Wristband-specific resources entities
router.use(wristbandRoutes);

module.exports = router;
