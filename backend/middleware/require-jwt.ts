import { Request, Response, NextFunction } from 'express';

import { wristbandJwtValidator } from '../wristband';

export default async function requireJwt(req: Request, res: Response, next: NextFunction) {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const token = wristbandJwtValidator.extractBearerToken(req.headers.authorization);
    const result = await wristbandJwtValidator.validate(token);

    if (!result.isValid) {
      console.error('[requireJwtAuth] ', result.errorMessage);
      res.status(401).send();
      return;
    }

    next();
  } catch (error: unknown) {
    console.error('[requireJwtAuth] ', error);
    res.status(401).send();
  }
}
