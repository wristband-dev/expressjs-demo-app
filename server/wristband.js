'use strict';

const { createWristbandAuth } = require('@wristband/express-auth');
const { createWristbandJwtValidator } = require('@wristband/typescript-jwt');

const { INVOTASTIC_HOST } = require('./utils/constants');

const wristbandApplicationVanityDomain = process.env.APPLICATION_VANITY_DOMAIN;

const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // IMPORTANT: If deploying your own app to production, do not disable secure cookies.
  dangerouslyDisableSecureCookies: true,
  isApplicationCustomDomainActive: false,
  loginStateSecret: 'dummyval-ab7d-4134-9307-2dfcc52f7475',
  loginUrl: `http://${INVOTASTIC_HOST}/api/auth/login`,
  redirectUri: `http://${INVOTASTIC_HOST}/api/auth/callback`,
  wristbandApplicationVanityDomain,
});

const wristbandJwtValidator = createWristbandJwtValidator({ wristbandApplicationVanityDomain });

module.exports = { wristbandAuth, wristbandJwtValidator };
