'use strict';

const Tokens = require('csrf');

const { CSRF_TOKEN_COOKIE_NAME } = require('./constants');

const csrfTokens = new Tokens();

exports.createCsrfSecret = function () {
  return csrfTokens.secretSync();
};

exports.isCsrfTokenValid = function (req) {
  /* CSRF_TOUCHPOINT */
  return csrfTokens.verify(req.session.csrfSecret, req.headers['x-xsrf-token']);
};

// Set a 30 minute CSRF cookie expiration in order to match the session cookie expiration.
exports.updateCsrfTokenAndCookie = function (req, res) {
  /* CSRF_TOUCHPOINT */
  const csrfToken = csrfTokens.create(req.session.csrfSecret);
  res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    maxAge: 1800000,
    path: '/',
    sameSite: true,
    secure: false,
  });
};

exports.getValueForDeletableField = (value) => {
  if (value === null || value === '') {
    return null;
  }

  return value || undefined;
};

exports.bearerToken = (req) => {
  if (!req || !req.session || !req.session.accessToken) {
    throw new Error('No access token found in session for auth header.');
  }

  return { headers: { Authorization: `Bearer ${req.session.accessToken}` } };
};

exports.normalizePhoneNumber = (phoneNumber = '') => {
  const value = phoneNumber.replace(/\s+/g, '').replace('(', '').replace(')', '').replace('-', '');
  return value === '+' ? '' : value;
};

exports.addressToTextBlock = (address = {}) => {
  const { street1, street2, city, state, zipCode } = address;
  const streetInfo = street2 ? `${street1}\n${street2}` : street1;
  return `${streetInfo}\n${city}, ${state} ${zipCode}`;
};

exports.hasAccessToApi = (requiredPermissions = [], currentPermissions = []) => {
  if (!requiredPermissions.length || !currentPermissions.length) {
    return false;
  }

  return currentPermissions.every((currentPermission) => {
    return requiredPermissions.includes(currentPermission);
  });
};
