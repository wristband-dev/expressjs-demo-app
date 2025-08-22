'use strict';

const { wristbandJwtValidator } = require('../wristband');

const jwtAuthMiddleware = async function (req, res, next) {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const token = wristbandJwtValidator.extractBearerToken(req.headers.authorization);
    const result = await wristbandJwtValidator.validate(token);

    if (!result.isValid) {
      console.error('(JWT AUTH MIDDLEWARE) -> ', result.errorMessage);
      res.status(401).send();
      return;
    }

    next();
  } catch (error) {
    console.error('(JWT AUTH MIDDLEWARE) -> ', error);
    res.status(401).send();
  }
};

module.exports = jwtAuthMiddleware;
