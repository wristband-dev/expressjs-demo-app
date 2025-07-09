'use strict';

const express = require('express');

const helloWorldRoutes = require('./hello-world-routes');
const invotasticRoutes = require('./invotastic-routes');
const sessionRoutes = require('./session-routes');
const tokenRoutes = require('./token-routes');
const wristbandRoutes = require('./wristband-routes');
const jwtAuthMiddleware = require('../../middleware/jwt-auth-middleware');
const sessionCookieAuthMiddleware = require('../../middleware/session-cookie-auth-middleware');

const router = express.Router();

router.use((req, res, next) => {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const authMiddleware = ['/hello-world'].includes(req.path) ? jwtAuthMiddleware : sessionCookieAuthMiddleware;
  authMiddleware(req, res, next);
});

/**
 * These are protected routes that must have only a valid session cookie in the request
 * (no Authorization header required).
 */
router.use(invotasticRoutes); // Invotastic-specific resources (demo resources)
router.use(sessionRoutes); // Session Endpoint and React-Query APIs.
router.use(tokenRoutes); // Token Endpoint
router.use(wristbandRoutes); // Wristband-specific resources

/**
 * These are protected routes that must have only a Bearer token in the request's
 * Authorization header (no cookie required).
 */
router.use(helloWorldRoutes); // Dummy route to demonstrate access token protection

module.exports = router;
