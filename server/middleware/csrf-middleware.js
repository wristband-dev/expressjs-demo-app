'use strict';

const { isCsrfTokenValid, updateCsrfTokenAndCookie } = require('../utils/util');

// Middleware that validates that a CSRF token is present in the request header and is valid
// when compared against the secret stored in the user's session data.  After validation,
// a new CSRF token is generated and set into the CSRF response cookie.  This cookie has the same
// max age as the session cookie since the CSRF secret is stored in the user's session data.
const csrfMiddleware = function (req, res, next) {
  /* CSRF_TOUCHPOINT */
  if (!isCsrfTokenValid(req)) {
    return res.status(403).send();
  }

  /* CSRF_TOUCHPOINT */
  updateCsrfTokenAndCookie(req, res);
  return next();
};

module.exports = csrfMiddleware;
