import { apiClient } from 'client';

export const fetchSessionCompany = async function () {
  const response = await apiClient.get(`/v1/company-info`);
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
