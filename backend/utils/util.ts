import { Request } from 'express';

export function getValueForDeletableField(value: string | null | undefined): string | null | undefined {
  if (value === null || value === '') {
    return null;
  }

  return value || undefined;
}

export function bearerToken(req: Request): { headers: { Authorization: string } } {
  if (!req || !req.session || !req.session.accessToken) {
    throw new Error('No access token found in session for auth header.');
  }

  return { headers: { Authorization: `Bearer ${req.session.accessToken}` } };
}

export function hasAccessToApi(requiredPermissions: string[] = [], currentPermissions: string[] = []): boolean {
  if (!requiredPermissions.length || !currentPermissions.length) {
    return false;
  }

  return currentPermissions.every((currentPermission) => {
    return requiredPermissions.includes(currentPermission);
  });
}
