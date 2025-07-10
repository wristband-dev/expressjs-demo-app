import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsService } from 'services';

export const useAssignableRoleOptions = () => {
  return useQuery(['assignable-role-options'], settingsService.fetchAssignableRoleOptions, { placeholderData: [] });
};

export const useNewUserInvites = () => {
  return useQuery(['new-user-invites'], settingsService.fetchNewUserInvites, {
    placeholderData: { items: [], totalResults: 0 },
  });
};

export const useCreateNewUserInvite = () => {
  const queryClient = useQueryClient();

  return useMutation(settingsService.createNewUserInvite, {
    onSuccess: () => alert('The user invite email has been sent.'),
    onError: (error) => {
      console.log(error);
      alert(error.response.data.code);
    },
    onSettled: () => queryClient.invalidateQueries('new-user-invites'),
  });
};

export const useCancelNewUserInvite = () => {
  const queryClient = useQueryClient();

  return useMutation(settingsService.cancelNewUserInvite, {
    onMutate: async () => await queryClient.cancelQueries('new-user-invites'),
    onError: (error) => {
      console.log(error);
      alert(error.response.data.code);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['new-user-invites'] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(settingsService.updateUser, {
    onMutate: async (updatedUser) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['session-user'], exact: true });
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(['session-user']);
      // Optimistically update to the new value
      queryClient.setQueryData(['session-user'], { ...previousUser, ...updatedUser });
      // Return a context with the previous and new value
      return { previousUser, updatedUser };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session-user'], data);
      alert('Profile updated successfully.');
    },
    onError: (error, updatedUser, context) => {
      console.log(error);
      queryClient.setQueryData(['session-user'], context.previousUser);
      alert(error.response.data.code);
    },
  });
};
