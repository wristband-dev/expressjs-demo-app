import { Request, Response } from 'express';
import { CallbackResultType } from '@wristband/express-auth';

import * as wristbandService from '../services/wristband-service';
import { bearerToken } from '../utils/util';
import { wristbandAuth } from '../wristband';

/**
 * Login Endpoint
 */
export async function login(req: Request, res: Response) {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  // Redirect out to the Wristband authorize endpoint to start the login process via OAuth2/OIDC Auth Code flow.
  const loginUrl = await wristbandAuth.login(req, res);
  return res.redirect(loginUrl);
}

/**
 * Callback Endpoint
 */
export async function authCallback(req: Request, res: Response) {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  // After the user authenticates, exchange the incoming authorization code for JWTs and also retrieve userinfo.
  const callbackResult = await wristbandAuth.callback(req, res);
  const { callbackData, redirectUrl, type } = callbackResult;

  if (type === CallbackResultType.REDIRECT_REQUIRED) {
    // For certain edge cases, you'll need to redirect to the URL returned from the SDK.
    return res.redirect(redirectUrl!);
  }

  // Save any necessary fields for the user's app session into a session cookie.
  req.session.fromCallback(callbackData!, { customField: 'No pineapple on pizza' });
  await req.session.save();

  // Send the user back to the application.
  return res.redirect(callbackData!.returnUrl || 'http://localhost:6001/home');
}

/**
 * Logout Endpoint
 */
export async function logout(req: Request, res: Response) {
  // Always destroy the session.
  const { refreshToken, tenantName } = req.session;
  req.session.destroy();

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const logoutUrl = await wristbandAuth.logout(req, res, { tenantName, refreshToken });
  return res.redirect(logoutUrl);
}

/**
 * Session Endpoint
 *
 * Data loaded upon app mount and stored in Wristband's react-client-auth SDK cache.
 * This API is the entrypoint for the React SPA.
 */
export async function getSessionResponse(req: Request, res: Response) {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');

  const { tenantId, userId } = req.session;

  /* WRISTBAND_TOUCHPOINT - RESOURCE API */
  const [user, assignedRole, company] = await Promise.all([
    wristbandService.getUser(userId!, bearerToken(req)),
    wristbandService.getAssignedRole(userId!, bearerToken(req)),
    wristbandService.getTenant(tenantId!, bearerToken(req)),
  ]);

  if (user.status !== 'ACTIVE' || !assignedRole) {
    return res.status(401).send();
  }

  // Session response metadata is optional.
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const sessionResponse = req.session.getSessionResponse({ user, assignedRole, company });
  return res.status(200).json(sessionResponse);
}

/**
 * Token Endpoint
 *
 * Retrieves an access token and its expiration time to store in Wristband's react-client-auth SDK.
 * Calling Wrisband's React SDK getToken() function calls this endpoint when there is no access token
 * present in the React SDK client-side cache.
 */
export async function getTokenResponse(req: Request, res: Response) {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const tokenResponse = req.session.getTokenResponse();
  return res.status(200).json(tokenResponse);
}
