'use strict';

/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.

const apiClient = require('../client/api-client');

exports.cancelNewUserInvite = async function (newUserInvitationRequestId, requestConfig) {
  await apiClient.post(`/new-user-invitation/cancel-invite`, { newUserInvitationRequestId }, requestConfig);
};

exports.getAssignableRoleOptions = async function (tenantId, requestConfig) {
  const queryString = 'include_application_roles=true&fields=id,displayName&sort_by=displayName:asc';
  const response = await apiClient.get(`/tenants/${tenantId}/roles?${queryString}`, requestConfig);
  return response.data.items.map((role) => {
    return { value: role.id, label: role.displayName };
  });
};

exports.getAssignedRole = async function (userId, requestConfig) {
  const response = await apiClient.get(`/users/${userId}/roles?fields=id,name,displayName&count=1`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0 ? items[0] : null;
};

exports.getIdentityProviderByNameForTenant = async function (tenantId, identityProviderName, requestConfig) {
  const nameQuery = `names=${identityProviderName}`;
  const path = `/tenants/${tenantId}/identity-providers/resolve-overrides?${nameQuery}`;
  const response = await apiClient.post(path, null, requestConfig);
  return response.data.items[0].item;
};

exports.getNewUserInviteRequestsForTenant = async function (tenantId, requestConfig) {
  const statusFilter = `?query=${encodeURIComponent(`status eq "PENDING_INVITE_ACCEPTANCE"`)}`;
  const path = `/tenants/${tenantId}/new-user-invitation-requests${statusFilter}`;
  const response = await apiClient.get(path, requestConfig);
  return response.data;
};

exports.getPermissionInfo = async function (values, requestConfig) {
  const response = await apiClient.get(`/permission-info?values=${values.join(',')}`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0
    ? items.map((item) => {
        return item.value;
      })
    : [];
};

exports.getTenant = async function (tenantId, requestConfig) {
  const tenantResponse = await apiClient.get(`/tenants/${tenantId}`, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};

exports.getUser = async function (userId, requestConfig) {
  const response = await apiClient.get(`/users/${userId}`, requestConfig);
  return response.data;
};

exports.getUserSchemaForTenant = async function (tenantId, requestConfig) {
  const response = await apiClient.post(`/tenants/${tenantId}/user-schemas/resolve-overrides`, null, requestConfig);
  return response.data;
};

exports.inviteNewUser = async function (tenantId, email, roleId, requestConfig) {
  const inviteData = { tenantId, email, rolesToAssign: [roleId], language: 'en-US' };
  await apiClient.post(`/new-user-invitation/invite-user`, inviteData, requestConfig);
};

exports.updateTenant = async function (tenantId, tenantData, requestConfig) {
  const tenantResponse = await apiClient.patch(`/tenants/${tenantId}`, tenantData, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};

exports.updateUser = async function (userId, userData, requestConfig) {
  const response = await apiClient.patch(`/users/${userId}`, userData, requestConfig);
  return response.data;
};
