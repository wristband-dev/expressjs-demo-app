'use strict';

const { CallbackResultType } = require('@wristband/express-auth');

const wristbandAuth = require('../wristband-auth');
const { CSRF_TOKEN_COOKIE_NAME, INVOTASTIC_HOST, SESSION_COOKIE_NAME } = require('../utils/constants');
const { createCsrfToken, updateCsrfCookie } = require('../utils/csrf');

exports.login = async (req, res, next) => {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // Redirect out to the Wristband authorize endpoint to start the login process via OAuth2/OIDC Auth Code flow.
    const loginUrl = await wristbandAuth.login(req, res);
    res.redirect(loginUrl);
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
    const { callbackData, redirectUrl, type } = callbackResult;

    if (type === CallbackResultType.REDIRECT_REQUIRED) {
      // For certain edge cases, you'll need to redirect to the URL returned from the SDK.
      return res.redirect(redirectUrl);
    }

    // If the SDK determine a redirect is required, then we can save any necessary fields for the user's app
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
    req.session.csrfToken = createCsrfToken();

    await req.session.save();

    /* CSRF_TOUCHPOINT */
    updateCsrfCookie(req, res);

    // Send the user back to the Invotastic application.
    const tenantDomain = process.env.DOMAIN_FORMAT === 'VANITY_DOMAIN' ? `${callbackData.tenantDomainName}.` : '';
    return res.redirect(callbackData.returnUrl || `http://${tenantDomain}${INVOTASTIC_HOST}/home`);
  } catch (err) {
    console.error(err);
    return next(err);
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
    const logoutUrl = await wristbandAuth.logout(req, res, { tenantCustomDomain, tenantDomainName, refreshToken });
    return res.redirect(logoutUrl);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
