import { useQuery } from '@tanstack/react-query';

import { sessionService } from 'services';

const fetchQueryOptions = { cacheTime: Infinity, staleTime: Infinity, placeholderData: {} };

export const useSessionCompany = () => {
  return useQuery(['session-company'], sessionService.fetchSessionCompany, fetchQueryOptions);
};

export const useSessionRole = () => {
  return useQuery(['session-role'], sessionService.fetchSessionRole, fetchQueryOptions);
};

export const useSessionUser = () => {
  return useQuery(['session-user'], sessionService.fetchSessionUser, fetchQueryOptions);
};
