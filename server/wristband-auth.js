'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const { createWristbandAuth } = require('@wristband/express-auth');

const { INVOTASTIC_HOST } = require('./utils/constants');

const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  loginStateSecret: '7ffdbecc-ab7d-4134-9307-2dfcc52f7475',
  loginUrl: `http://{tenant_domain}.${INVOTASTIC_HOST}/api/auth/login`,
  redirectUri: `http://{tenant_domain}.${INVOTASTIC_HOST}/api/auth/callback`,
  rootDomain: INVOTASTIC_HOST,
  useCustomDomains: true,
  useTenantSubdomains: true,
  wristbandApplicationDomain: process.env.APPLICATION_DOMAIN,
});

module.exports = wristbandAuth;
