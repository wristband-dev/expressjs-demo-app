import express from 'express';

import * as authController from '../controllers/auth-controller';
import { requireWristbandAuth } from '../wristband';

const router = express.Router();

/**
 * All public auth endpoints that are called from an unauthenticated state.
 */
router.get('/login', authController.login);
router.get('/callback', authController.authCallback);
router.get('/logout', authController.logout);

// Session Endpoint: Data loaded upon app mount and stored in Wristband's react-client-auth SDK cache.
/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
router.get('/session', requireWristbandAuth, authController.getSessionResponse);

// Token Endpoint: Retrieves an access token and its expiration time to store in Wristband's react-client-auth SDK.
// Calling Wrisband's React SDK getToken() function calls this endpoint when there is no access token present in
// the React SDK client-side cache.
/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
router.get('/token', requireWristbandAuth, authController.getTokenResponse);

export default router;
