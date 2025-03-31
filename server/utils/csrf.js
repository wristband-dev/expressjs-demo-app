'use strict';

const Tokens = require('csrf');

const { CSRF_TOKEN_COOKIE_NAME } = require('./constants');

const csrfTokens = new Tokens();

exports.createCsrfSecret = function () {
  return csrfTokens.secretSync();
};

exports.isCsrfTokenValid = function (req) {
  /* CSRF_TOUCHPOINT */
  return csrfTokens.verify(req.session.csrfSecret, req.headers['x-xsrf-token']);
};

// Set a 30 minute CSRF cookie expiration in order to match the session cookie expiration.
// NOTE: If deploying your own app to production, do not disable secure cookies.
exports.updateCsrfTokenAndCookie = function (req, res) {
  /* CSRF_TOUCHPOINT */
  const csrfToken = csrfTokens.create(req.session.csrfSecret);
  res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    maxAge: 1800000,
    path: '/',
    sameSite: true,
    secure: false,
  });
};
