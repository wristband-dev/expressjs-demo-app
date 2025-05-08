'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const { createWristbandAuth } = require('@wristband/express-auth');
const { INVOTASTIC_HOST, LOGIN_STATE_COOKIE_SECRET } = require('./utils/constants');

const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // NOTE: If deploying your own app to production, do not disable secure cookies.
  dangerouslyDisableSecureCookies: true,
  loginStateSecret: LOGIN_STATE_COOKIE_SECRET,
  loginUrl: `http://${INVOTASTIC_HOST}/api/auth/login`,
  redirectUri: `http://${INVOTASTIC_HOST}/api/auth/callback`,
  useCustomDomains: false,
  useTenantSubdomains: false,
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN,
});

module.exports = wristbandAuth;
