'use strict';

const { createWristbandAuth } = require('@wristband/express-auth');
const { createWristbandJwtValidator } = require('@wristband/typescript-jwt');

const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN,
});

const wristbandJwtValidator = createWristbandJwtValidator({
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN,
});

module.exports = { wristbandAuth, wristbandJwtValidator };
