'use strict';

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

exports.hasAccessToApi = (requiredPermissions = [], currentPermissions = []) => {
  if (!requiredPermissions.length || !currentPermissions.length) {
    return false;
  }

  return currentPermissions.every((currentPermission) => {
    return requiredPermissions.includes(currentPermission);
  });
};
