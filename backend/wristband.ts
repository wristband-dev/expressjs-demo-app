/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
import { createWristbandAuth } from '@wristband/express-auth';
import { createWristbandSession } from '@wristband/express-auth/session';
import { createWristbandJwtValidator } from '@wristband/typescript-jwt';

// Wristband authentication client for handling login, callback, and logout flows.
export const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
});

// JWT validator for verifying Wristband access tokens.
export const wristbandJwtValidator = createWristbandJwtValidator({
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
});

// Session middleware for encrypted cookie-based session management.
export function wristbandSession() {
  return createWristbandSession({ secrets: 'dummyval-b5c1-463a-812c-0d8db87c0ec5' });
}

// Middleware that ensures the user is authenticated and refreshes tokens if needed.
export const requireWristbandAuth = wristbandAuth.createRequireSessionAuth();
