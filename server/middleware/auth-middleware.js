'use strict';

const wristbandAuth = require('../wristband-auth');

// Middleware that ensures there is an authenticated user session and JWTs are present.
const authMiddleware = async function (req, res, next) {
  const { csrfSecret, expiresAt, isAuthenticated, refreshToken } = req.session;
  if (!isAuthenticated || !csrfSecret) {
    return res.status(401).send();
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

    // Save the session in order to "touch" it (even if there is no new token data).
    await req.session.save();
    return next();
  } catch (error) {
    console.error(`Failed to refresh token due to: ${error}`);
    return res.status(401).send();
  }
};

module.exports = authMiddleware;
