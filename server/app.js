'use strict';

const express = require('express');
const path = require('path');
const { getIronSession } = require('iron-session');

const errorHandler = require('./middleware/error-handler');
const routes = require('./routes/index');
const { SESSION_COOKIE_NAME } = require('./utils/constants');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable encrypted cookie-based sessions
app.use(async (req, res, next) => {
  req.session = await getIronSession(req, res, {
    cookieName: SESSION_COOKIE_NAME,
    password: 'dummyval-b5c1-463a-812c-0d8db87c0ec5', // 32-character minimum
    cookieOptions: {
      httpOnly: true,
      maxAge: 1800, // The expiration time of the cookie in seconds -> 30 min
      path: '/',
      sameSite: true,
      // IMPORTANT: "secure" should only be set to false for development environments where HTTPS
      // is not enabled on the server.
      secure: false,
    },
  });
  next();
});

// Defined routes for all API endpoint/non-static assets
app.use('/api', routes);

// Serve static assets if in production mode.
if (process.env.NODE_ENV === 'production') {
  console.info('Production ENV detected. Serving up static assets.');
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Catch-all for any unexpected server-side errors.
app.use(errorHandler);

module.exports = app;
