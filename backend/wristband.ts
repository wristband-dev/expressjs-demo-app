import { createWristbandAuth } from '@wristband/express-auth';
import { createWristbandSession } from '@wristband/express-auth/session';

// Enable req.auth typing on Express Request when using JWT auth strategy
import '@wristband/express-auth/jwt';

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */

/**
 * Wristband authentication client for handling OAuth flows (login, callback, logout).
 *
 * Use this client to:
 * - Initiate login redirects: `wristbandAuth.pagesRouter.login()`
 * - Handle OAuth callbacks: `wristbandAuth.pagesRouter.callback()`
 * - Handle logout: `wristbandAuth.pagesRouter.logout()`
 * - Create authentication middleware and session helpers
 */
export const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
  dangerouslyDisableSecureCookies: true, // IMPORTANT: Only for local development. Remove in production!!
});

/**
 * Session configuration used across all middlewares.
 */
const sessionOptions = {
  secrets: 'dummyval-b5c1-463a-812c-0d8db87c0ec5', // IMPORTANT: In production, use a strong secret!!
  secure: false, // IMPORTANT: In production, set "secure: true"!!
};

/**
 * Session middleware for encrypted cookie-based session management.
 *
 * NOTE: User data and session functions are made available via `req.session`.
 */
export function wristbandSession() {
  return createWristbandSession(sessionOptions);
}

/**
 * Auth middleware that ensures the user is authenticated via configured strategies.
 *
 * Tries each configured strategy in order until one succeeds. If multiple strategies are
 * configured (e.g., ['JWT', 'SESSION']), it will attempt JWT authentication first and
 * fall back to SESSION if JWT fails.
 *
 * For JWT strategy: Verifies a valid Wristband access token is present in the Authorization header.
 * For SESSION strategy: Validates the user's session and refreshes tokens if needed.
 *
 * NOTE: For JWT, if auth succeeds, then `req.auth` is populated with the bearer token as well
 * as the decoded JWT payload.
 */
export const requireWristbandAuth = wristbandAuth.createAuthMiddleware({
  authStrategies: ['JWT', 'SESSION'],
  sessionConfig: { sessionOptions },
});
