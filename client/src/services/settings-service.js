import { apiClient } from 'client';

export const cancelNewUserInvite = async function (requestId) {
  await apiClient.post(`/v1/cancel-new-user-invite`, { requestId });
};

export const createNewUserInvite = async function (request) {
  await apiClient.post(`/v1/invite-new-user`, request);
};

export const fetchAssignableRoleOptions = async function () {
  const response = await apiClient.get(`/v1/assignable-role-options`);
  return response.data.assignableRoleOptions;
};

export const fetchNewUserInvites = async function () {
  const response = await apiClient.get(`/v1/new-user-invitation-requests`);
  return response.data;
};

export const updateUser = async function (user) {
  const { id, ...updatedUser } = user;
  const response = await apiClient.patch(`/v1/users/${id}`, updatedUser);
  return response.data;
};
