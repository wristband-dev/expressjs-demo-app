'use strict';

const apitopiaService = require('../services/wristband-service');
const { bearerToken } = require('../utils/util');

const APITOPIA_IDP_NAME = 'apitopia';

exports.sessionData = async (req, res, next) => {
  const { identityProviderName, tenantId, userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, assignedRole, idp, pwPolicy, userSchema, company] = await Promise.all([
      apitopiaService.getUser(userId, bearerToken(req)),
      apitopiaService.getAssignedRole(userId, bearerToken(req)),
      apitopiaService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, bearerToken(req)),
      apitopiaService.getPasswordPolicyForTenant(tenantId, bearerToken(req)),
      apitopiaService.getUserSchemaForTenant(tenantId, bearerToken(req)),
      apitopiaService.getTenant(tenantId, bearerToken(req)),
    ]);

    if (user.status !== 'ACTIVE' || !assignedRole) {
      return res.status(401).send();
    }

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isApitopiaIdp = identityProviderName === APITOPIA_IDP_NAME;

    return res.status(200).json({
      user,
      assignedRole,
      company,
      configs: {
        usernameRequired: isApitopiaIdp && idp.loginIdentifiers.includes('USERNAME'),
        passwordRequired: isApitopiaIdp && idp.loginFactors.includes('PASSWORD'),
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
    const user = await apitopiaService.getUser(userId, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

exports.roleInfo = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const assignedRole = await apitopiaService.getAssignedRole(userId, bearerToken(req));
    return res.status(200).json(assignedRole);
  } catch (error) {
    return next(error);
  }
};

exports.companyInfo = async (req, res, next) => {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const company = await apitopiaService.getTenant(tenantId, bearerToken(req));
    return res.status(200).json(company);
  } catch (error) {
    return next(error);
  }
};

exports.sessionConfigs = async (req, res, next) => {
  const { identityProviderName, tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [apitopiaIdp, pwPolicy, userSchema] = await Promise.all([
      apitopiaService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, bearerToken(req)),
      apitopiaService.getPasswordPolicyForTenant(tenantId, bearerToken(req)),
      apitopiaService.getUserSchemaForTenant(tenantId, bearerToken(req)),
    ]);

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isApitopiaIdp = identityProviderName === APITOPIA_IDP_NAME;

    return res.status(200).json({
      usernameRequired: isApitopiaIdp && apitopiaIdp.loginIdentifiers.includes('USERNAME'),
      passwordRequired: isApitopiaIdp && apitopiaIdp.loginFactors.includes('PASSWORD'),
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
    const assignableRoleOptions = await apitopiaService.getAssignableRoleOptions(tenantId, bearerToken(req));
    return res.status(200).json({ assignableRoleOptions });
  } catch (error) {
    return next(error);
  }
};
