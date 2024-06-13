'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const ironSession = require('./middleware/init-iron-session');
const errorHandler = require('./middleware/error-handler');
const routes = require('./routes/index');
const { SESSION_COOKIE_NAME, SESSION_COOKIE_SECRET } = require('./utils/constants');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 30 minute cookie-based session
// NOTE: If deploying your own app to production, do not disable secure cookies.
app.use(
  ironSession({
    cookieName: SESSION_COOKIE_NAME,
    password: SESSION_COOKIE_SECRET,
    cookieOptions: {
      httpOnly: true,
      maxAge: 1800,
      path: '/',
      sameSite: true,
      secure: false,
    },
  })
);

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
