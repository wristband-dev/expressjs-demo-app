/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.
import apiClient from '../client/api-client';

interface RoleOption {
  value: string;
  label: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
}

interface Tenant {
  id: string;
  displayName: string;
  domainName: string;
  invoiceEmail: string;
}

interface TenantResponse {
  displayName: string;
  domainName: string;
  publicMetadata: {
    invoiceEmail: string;
  };
}

interface RequestConfig {
  headers?: {
    Authorization?: string;
  };
}

export async function cancelNewUserInvite(
  newUserInvitationRequestId: string,
  requestConfig: RequestConfig
): Promise<void> {
  await apiClient.post(`/new-user-invitation/cancel-invite`, { newUserInvitationRequestId }, requestConfig);
}

export async function getAssignableRoleOptions(tenantId: string, requestConfig: RequestConfig): Promise<RoleOption[]> {
  const queryString = 'include_application_roles=true&fields=id,displayName&sort_by=displayName:asc';
  const response = await apiClient.get(`/tenants/${tenantId}/roles?${queryString}`, requestConfig);
  return response.data.items.map((role: any) => {
    return { value: role.id, label: role.displayName };
  });
}

export async function getAssignedRole(userId: string, requestConfig: RequestConfig): Promise<Role | null> {
  const response = await apiClient.get(`/users/${userId}/roles?fields=id,name,displayName&count=1`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0 ? items[0] : null;
}

export async function getNewUserInviteRequestsForTenant(tenantId: string, requestConfig: RequestConfig): Promise<any> {
  const statusFilter = `?query=${encodeURIComponent(`status eq "PENDING_INVITE_ACCEPTANCE"`)}`;
  const path = `/tenants/${tenantId}/new-user-invitation-requests${statusFilter}`;
  const response = await apiClient.get(path, requestConfig);
  return response.data;
}

export async function getPermissionInfo(values: string[], requestConfig: RequestConfig): Promise<string[]> {
  const response = await apiClient.get(`/permission-info?values=${values.join(',')}`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0
    ? items.map((item: any) => {
        return item.value;
      })
    : [];
}

export async function getTenant(tenantId: string, requestConfig: RequestConfig): Promise<Tenant> {
  const tenantResponse = await apiClient.get(`/tenants/${tenantId}`, requestConfig);
  const tenant: TenantResponse = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
}

export async function getUser(userId: string, requestConfig: RequestConfig): Promise<any> {
  const response = await apiClient.get(`/users/${userId}`, requestConfig);
  return response.data;
}

export async function inviteNewUser(
  tenantId: string,
  email: string,
  roleId: string,
  requestConfig: RequestConfig
): Promise<void> {
  const inviteData = { tenantId, email, rolesToAssign: [roleId], language: 'en-US' };
  await apiClient.post(`/new-user-invitation/invite-user`, inviteData, requestConfig);
}

export async function updateUser(userId: string, userData: any, requestConfig: RequestConfig): Promise<any> {
  const response = await apiClient.patch(`/users/${userId}`, userData, requestConfig);
  return response.data;
}
