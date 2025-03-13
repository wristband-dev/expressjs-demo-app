'use strict';

const { CallbackResultType } = require('@wristband/express-auth');

const wristbandAuth = require('../wristband-auth');
const { CSRF_TOKEN_COOKIE_NAME, INVOTASTIC_HOST, SESSION_COOKIE_NAME } = require('../utils/constants');
const { createCsrfSecret, updateCsrfTokenAndCookie } = require('../utils/util');

exports.login = async (req, res, next) => {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // Redirect out to the Wristband authorize endpoint to start the login process via OAuth2/OIDC Auth Code flow.
    await wristbandAuth.login(req, res);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.authCallback = async (req, res, next) => {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // After the user authenticates, exchange the incoming authorization code for JWTs and also retrieve userinfo.
    const callbackResult = await wristbandAuth.callback(req, res);
    const { callbackData, result } = callbackResult;

    if (result === CallbackResultType.REDIRECT_REQUIRED) {
      // The SDK will have already invoked the redirect() function, so we just stop execution here.
      return;
    }

    // If the SDK does not need to return a redirect response, then we can save any necessary fields for the user's app
    // session into a session cookie.
    req.session.isAuthenticated = true;
    req.session.accessToken = callbackData.accessToken;
    // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
    req.session.expiresAt = Date.now() + callbackData.expiresIn * 1000;
    req.session.refreshToken = callbackData.refreshToken;
    req.session.userId = callbackData.userinfo.sub;
    req.session.tenantId = callbackData.userinfo.tnt_id;
    req.session.identityProviderName = callbackData.userinfo.idp_name;
    req.session.tenantDomainName = callbackData.tenantDomainName;
    req.session.tenantCustomDomain = callbackData.tenantCustomDomain || undefined;
    /* CSRF_TOUCHPOINT */
    req.session.csrfSecret = createCsrfSecret();

    await req.session.save();

    /* CSRF_TOUCHPOINT */
    updateCsrfTokenAndCookie(req, res);

    // Send the user back to the Invotastic application.
    const tenantDomain = process.env.DOMAIN_FORMAT === 'VANITY_DOMAIN' ? `${callbackData.tenantDomainName}.` : '';
    res.redirect(callbackData.returnUrl || `http://${tenantDomain}${INVOTASTIC_HOST}/home`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { session } = req;
  const { refreshToken, tenantCustomDomain, tenantDomainName } = session;

  /* CSRF_TOUCHPOINT */
  // Always clear the session and CSRF cookies.
  res.clearCookie(SESSION_COOKIE_NAME);
  res.clearCookie(CSRF_TOKEN_COOKIE_NAME);
  session.destroy();

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    return await wristbandAuth.logout(req, res, { tenantCustomDomain, tenantDomainName, refreshToken });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
