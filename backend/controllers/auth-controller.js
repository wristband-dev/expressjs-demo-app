'use strict';

const { CallbackResultType } = require('@wristband/express-auth');

const { wristbandAuth } = require('../wristband');
const { APP_HOST, CSRF_TOKEN_COOKIE_NAME, SESSION_COOKIE_NAME } = require('../utils/constants');
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

    // Save any necessary fields for the user's app session into a session cookie.
    req.session.isAuthenticated = true;
    req.session.accessToken = callbackData.accessToken;
    req.session.expiresAt = callbackData.expiresAt;
    req.session.refreshToken = callbackData.refreshToken;
    req.session.userId = callbackData.userinfo.sub;
    req.session.tenantId = callbackData.userinfo.tnt_id;
    req.session.tenantDomainName = callbackData.tenantDomainName;

    /* CSRF_TOUCHPOINT */
    req.session.csrfToken = createCsrfToken();
    updateCsrfCookie(req, res);

    await req.session.save();

    // Send the user back to the Invotastic application.
    const tenantDomain = process.env.DOMAIN_FORMAT === 'VANITY_DOMAIN' ? `${callbackData.tenantDomainName}.` : '';
    return res.redirect(callbackData.returnUrl || `http://${tenantDomain}${APP_HOST}/home`);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { session } = req;
  const { refreshToken, tenantDomainName } = session;

  /* CSRF_TOUCHPOINT */
  // Always clear the session and CSRF cookies.
  res.clearCookie(CSRF_TOKEN_COOKIE_NAME);
  res.clearCookie(SESSION_COOKIE_NAME);
  session.destroy();

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const logoutUrl = await wristbandAuth.logout(req, res, { tenantDomainName, refreshToken });
    return res.redirect(logoutUrl);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
