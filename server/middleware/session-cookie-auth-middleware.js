'use strict';

const { wristbandAuth } = require('../wristband');
const { updateCsrfCookie } = require('../utils/csrf');

// Middleware that ensures there is an authenticated cookie session and valid CSRF.
// It will refresh the access token if it is expired.
const sessionCookieAuthMiddleware = async function (req, res, next) {
  const { csrfToken, expiresAt, isAuthenticated, refreshToken } = req.session;
  if (!isAuthenticated) {
    console.error('(SESSION COOKIE AUTH MIDDLEWARE) -> User is not authenticated.');
    return res.status(401).send();
  }

  /* CSRF_TOUCHPOINT */
  if (!csrfToken || csrfToken !== req.headers['x-csrf-token']) {
    console.error('(SESSION COOKIE AUTH MIDDLEWARE) -> Missing or invalid CSRF token.');
    return res.status(403).send();
  }

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const tokenData = await wristbandAuth.refreshTokenIfExpired(refreshToken, expiresAt);
    if (tokenData) {
      req.session.accessToken = tokenData.accessToken;
      // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
      req.session.expiresAt = Date.now() + tokenData.expiresIn * 1000;
      req.session.refreshToken = tokenData.refreshToken;
    }

    // "Touch" the session and CSRF cookies.
    await req.session.save();
    updateCsrfCookie(req, res);

    return next();
  } catch (error) {
    console.error(`(SESSION COOKIE AUTH MIDDLEWARE) -> Failed to refresh token due to: ${error}`);
    return res.status(401).send();
  }
};

module.exports = sessionCookieAuthMiddleware;
