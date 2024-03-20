'use strict';

const { WRISTBAND_IDP_NAME } = require('../utils/constants');
const { bearerToken, updateCsrfTokenAndCookie } = require('../utils/util');
const wristbandService = require('../services/wristband-service');

// This API is the entrypoint for the React app.
exports.sessionData = async (req, res, next) => {
  const { identityProviderName, tenantId, userId } = req.session;

  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, assignedRole, idp, pwPolicy, userSchema, company] = await Promise.all([
      wristbandService.getUser(userId, bearerToken(req)),
      wristbandService.getAssignedRole(userId, bearerToken(req)),
      wristbandService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, bearerToken(req)),
      wristbandService.getPasswordPolicyForTenant(tenantId, bearerToken(req)),
      wristbandService.getUserSchemaForTenant(tenantId, bearerToken(req)),
      wristbandService.getTenant(tenantId, bearerToken(req)),
    ]);

    if (user.status !== 'ACTIVE' || !assignedRole) {
      return res.status(401).send();
    }

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isWristbandIdp = identityProviderName === WRISTBAND_IDP_NAME;

    /* CSRF_TOUCHPOINT */
    // The entrypoint API is responsible for sending the initial CSRF token cookie back to the browser.
    updateCsrfTokenAndCookie(req, res);

    return res.status(200).json({
      user,
      assignedRole,
      company,
      configs: {
        usernameRequired: isWristbandIdp && idp.loginIdentifiers.includes('USERNAME'),
        passwordRequired: isWristbandIdp && idp.loginFactors.includes('PASSWORD'),
        passwordMinLength,
        requiredFields,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.userinfo = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.getUser(userId, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

exports.roleInfo = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const assignedRole = await wristbandService.getAssignedRole(userId, bearerToken(req));
    return res.status(200).json(assignedRole);
  } catch (error) {
    return next(error);
  }
};

exports.companyInfo = async (req, res, next) => {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const company = await wristbandService.getTenant(tenantId, bearerToken(req));
    return res.status(200).json(company);
  } catch (error) {
    return next(error);
  }
};

exports.sessionConfigs = async (req, res, next) => {
  const { identityProviderName, tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [wristbandIdp, pwPolicy, userSchema] = await Promise.all([
      wristbandService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, bearerToken(req)),
      wristbandService.getPasswordPolicyForTenant(tenantId, bearerToken(req)),
      wristbandService.getUserSchemaForTenant(tenantId, bearerToken(req)),
    ]);

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isWristbandIdp = identityProviderName === WRISTBAND_IDP_NAME;

    return res.status(200).json({
      usernameRequired: isWristbandIdp && wristbandIdp.loginIdentifiers.includes('USERNAME'),
      passwordRequired: isWristbandIdp && wristbandIdp.loginFactors.includes('PASSWORD'),
      passwordMinLength,
      requiredFields,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAssignableRoleOptions = async (req, res, next) => {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const assignableRoleOptions = await wristbandService.getAssignableRoleOptions(tenantId, bearerToken(req));
    return res.status(200).json({ assignableRoleOptions });
  } catch (error) {
    return next(error);
  }
};
