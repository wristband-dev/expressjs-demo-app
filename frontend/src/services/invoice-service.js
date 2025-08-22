import { apiClient } from 'client';

export const fetchInvoices = async function (companyId) {
  const response = await apiClient.get(`/v1/companies/${companyId}/invoices`);
  return response.data;
};

export const createInvoice = async function (invoice) {
  const response = await apiClient.post(`/v1/invoices`, invoice);
  return response.data;
};

export const updateInvoice = async function (invoice) {
  const { id, ...updatedInvoice } = invoice;
  const response = await apiClient.put(`/v1/invoices/${id}`, updatedInvoice);
  return response.data;
};
