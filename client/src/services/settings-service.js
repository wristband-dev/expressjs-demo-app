import { apiClient } from 'client';

export const cancelChangeEmailRequest = async function (request) {
  await apiClient.post(`/v1/cancel-email-change`, request);
};

export const cancelNewUserInvite = async function (requestId) {
  await apiClient.post(`/v1/cancel-new-user-invite`, { requestId });
};

export const changePassword = async function (request) {
  await apiClient.post(`/v1/change-password`, request);
};

export const createChangeEmailRequest = async function (request) {
  await apiClient.post(`/v1/request-email-change`, request);
};

export const createNewUserInvite = async function (request) {
  await apiClient.post(`/v1/invite-new-user`, request);
};

export const fetchAssignableRoleOptions = async function () {
  const response = await apiClient.get(`/v1/assignable-role-options`);
  return response.data.assignableRoleOptions;
};

export const fetchChangeEmailRequests = async function () {
  const response = await apiClient.get(`/v1/change-email-requests`);
  return response.data;
};

export const fetchNewUserInvites = async function () {
  const response = await apiClient.get(`/v1/new-user-invitation-requests`);
  return response.data;
};

export const fetchUserCount = async function () {
  const response = await apiClient.get(`/v1/user-count`);
  return response.data.userCount;
};
