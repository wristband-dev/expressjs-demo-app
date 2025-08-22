'use strict';

const { bearerToken } = require('../utils/util');
const wristbandService = require('../services/wristband-service');

/**
 * Session Endpoint: Data loaded upon app mount and stored in Wristband's react-client-auth SDK cache.
 * This API is the entrypoint for the React SPA.
 */
exports.session = async (req, res, next) => {
  const { tenantId, userId } = req.session;

  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, assignedRole, company] = await Promise.all([
      wristbandService.getUser(userId, bearerToken(req)),
      wristbandService.getAssignedRole(userId, bearerToken(req)),
      wristbandService.getTenant(tenantId, bearerToken(req)),
    ]);

    if (user.status !== 'ACTIVE' || !assignedRole) {
      return res.status(401).send();
    }

    return res.status(200).json({
      userId, // required field
      tenantId, // required field
      metadata: { user, assignedRole, company }, // metadata is optional
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Session data for React-Query: The following controllers are used to to load data on-demand per-page/component,
 * or during React-Query cache refresh. These endpoints are for demo purposes and are unrelated to Wristband SDKs.
 */
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
