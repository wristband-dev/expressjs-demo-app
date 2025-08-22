'use strict';

const crypto = require('crypto');

const { CSRF_TOKEN_COOKIE_NAME } = require('./constants');

exports.createCsrfToken = function () {
  return crypto.randomBytes(32).toString('hex');
};

// Set a 30 minute CSRF cookie expiration in order to match the session cookie expiration.
// NOTE: If deploying your own app to production, do not disable secure cookies.
exports.updateCsrfCookie = function (req, res) {
  const { csrfToken } = req.session;
  res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    maxAge: 1800000,
    path: '/',
    sameSite: true,
    // IMPORTANT: "secure" should be set to true in production.
    secure: true,
  });
};
