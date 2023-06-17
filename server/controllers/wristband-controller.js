'use strict';

const wristbandService = require('../services/wristband-service');
const { FORBIDDEN_ACCESS_RESPONSE, NOT_FOUND } = require('../utils/constants');
const { bearerToken, getValueForDeletableField, normalizePhoneNumber } = require('../utils/util');
const {
  reqValidation,
  newEmailExists,
  emailExists,
  hasConstraintsViolations,
  newEmailUnchanged,
  invalidPhoneNumber,
  INVALID_PHONE_NUMBER,
  INVALID_REQUEST,
} = require('../utils/validation');

exports.updateUser = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.params;
  const userData = {
    email: req.body.email,
    status: req.body.status,
    username: getValueForDeletableField(req.body.username),
    givenName: getValueForDeletableField(req.body.givenName),
    familyName: getValueForDeletableField(req.body.familyName),
    fullName: getValueForDeletableField(req.body.fullName),
    phoneNumber: getValueForDeletableField(normalizePhoneNumber(req.body.phoneNumber)),
    birthdate: getValueForDeletableField(req.body.birthdate),
  };

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.updateUser(userId, userData, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    if (hasConstraintsViolations(error.response) && invalidPhoneNumber(error.response.data)) {
      return res.status(400).json({ code: INVALID_PHONE_NUMBER, message: 'Invalid phone number provided.' });
    }

    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.queryChangeEmailRequests = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const queryResults = await wristbandService.getChangeEmailRequestsForUser(userId, bearerToken(req));
    return res.status(200).json(queryResults);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.requestEmailChange = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.session;
  const { newEmail } = req.body;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.requestEmailChange(userId, newEmail, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    if (hasConstraintsViolations(error.response)) {
      if (newEmailUnchanged(error.response.data)) {
        return res.status(400).json({ code: INVALID_REQUEST, message: 'The email must be a new address.' });
      }
      if (newEmailExists(error.response.data)) {
        return res.status(400).json({ code: INVALID_REQUEST, message: 'The email address already exists.' });
      }
    }

    return next(error);
  }
};

exports.cancelEmailChange = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { requestId } = req.body;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.cancelEmailChange(requestId, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.session;
  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return res.status(400).json({ code: INVALID_REQUEST, message: 'Please use a different password.' });
  }

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.changePassword(userId, currentPassword, newPassword, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    const { response } = error;
    if (response && response.status === 400 && response.data.code === 'password_verification_failed') {
      return res.status(400).json({ code: INVALID_REQUEST, message: 'Password verification failed.' });
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

exports.getCompany = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { tenantId } = req.session;
  const { companyId } = req.params;

  if (companyId !== tenantId) {
    return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
  }

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const company = await wristbandService.getTenant(companyId, bearerToken(req));
    if (!company) {
      return res.status(404).send({ code: NOT_FOUND, message: 'Company could not be found' });
    }

    return res.status(200).json(company);
  } catch (error) {
    return next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { tenantId } = req.session;
  const { address, invoiceEmail, displayName } = req.body;
  const { companyId } = req.params;

  if (tenantId !== companyId) {
    return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
  }

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const tenantData = { displayName, publicMetadata: { address, invoiceEmail } };
    const updatedCompany = await wristbandService.updateTenant(companyId, tenantData, bearerToken(req));
    return res.status(200).json(updatedCompany);
  } catch (error) {
    return next(error);
  }
};

exports.getUserCount = async (req, res, next) => {
  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const userCount = await wristbandService.getUserCountForTenant(req.session.tenantId, bearerToken(req));
    return res.status(200).json({ userCount });
  } catch (error) {
    return next(error);
  }
};
