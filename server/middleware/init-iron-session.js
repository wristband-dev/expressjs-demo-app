'use strict';

const { getIronSession } = require('iron-session');

// Middleware to initialize Iron Session cookie-based sessions for the application.
// https://github.com/vvo/iron-session/issues/586#issuecomment-1825671315
const ironSession = function (sessionOptions) {
  return async function ironSessionMiddleware(req, res, next) {
    req.session = await getIronSession(req, res, sessionOptions);
    next();
  };
};

module.exports = ironSession;
