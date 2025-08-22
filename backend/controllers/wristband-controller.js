'use strict';

const wristbandService = require('../services/wristband-service');
const { bearerToken, getValueForDeletableField } = require('../utils/util');
const { reqValidation, emailExists, hasConstraintsViolations, INVALID_REQUEST } = require('../utils/validation');

exports.updateUser = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.params;
  const userData = {
    givenName: getValueForDeletableField(req.body.givenName),
    familyName: getValueForDeletableField(req.body.familyName),
  };

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.updateUser(userId, userData, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.queryNewUserInvitations = async (req, res, next) => {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const queryResults = await wristbandService.getNewUserInviteRequestsForTenant(tenantId, bearerToken(req));
    return res.status(200).json(queryResults);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.inviteNewUser = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { email, roleId } = req.body;
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.inviteNewUser(tenantId, email, roleId, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    if (hasConstraintsViolations(error.response) && emailExists(error.response.data)) {
      return res.status(400).json({ code: INVALID_REQUEST, message: 'The email address already exists.' });
    }

    return next(error);
  }
};

exports.cancelNewUserInvite = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { requestId } = req.body;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.cancelNewUserInvite(requestId, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
