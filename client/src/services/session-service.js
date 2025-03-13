import { apiClient } from 'client';

export const fetchSessionCompany = async function () {
  const response = await apiClient.get(`/v1/company-info`);
  return response.data;
};

export const fetchSessionConfigs = async function () {
  const response = await apiClient.get(`/v1/session-configs`);
  return response.data;
};

export const fetchSessionRole = async function () {
  const response = await apiClient.get(`/v1/role-info`);
  return response.data;
};

export const fetchSessionUser = async function () {
  const response = await apiClient.get(`/v1/user-info`);
  return response.data;
};

export const getInitialSessionData = async function () {
  const response = await apiClient.get(`/v1/session-data`);
  return response.data;
};

export const updateSessionCompany = async function (company) {
  const { id, ...updatedCompany } = company;
  const response = await apiClient.put(`/v1/companies/${id}`, updatedCompany);
  return response.data;
};

export const updateSessionUser = async function (user) {
  const { id, ...updatedUser } = user;
  const response = await apiClient.patch(`/v1/users/${id}`, updatedUser);
  return response.data;
};
