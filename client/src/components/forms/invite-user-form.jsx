import React, { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material';

import { settingsHooks } from 'hooks';

export function InviteUserForm() {
  const [assignedRole, setAssignedRole] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const { data: assignableRoleOptions } = settingsHooks.useAssignableRoleOptions();
  const { data: invites, error, isFetching, isInitialLoading } = settingsHooks.useNewUserInvites();
  const { data: userCount } = settingsHooks.useUserCount();
  const { mutate: cancelNewUserInvite } = settingsHooks.useCancelNewUserInvite();
  const { mutate: createNewUserInvite } = settingsHooks.useCreateNewUserInvite();
  const userLimitReached = userCount > 2;
  const { items, totalResults } = invites;
  const hasExistingInvite = totalResults > 0;

  useEffect(() => {
    if (!!assignableRoleOptions.length && !assignedRole) {
      setAssignedRole(assignableRoleOptions[0].value);
    }
  }, [assignableRoleOptions, assignableRoleOptions.length, assignedRole]);

  const inviteUser = () => {
    createNewUserInvite({ email: adminEmail, roleId: assignedRole }, {
      onSuccess: () => {
        // Clear the admin email text box after the invite is successfully sent
        setAdminEmail('');
      }
    });
  };

  const cancelInvite = (item) => {
    setAdminEmail('');
    setAssignedRole(assignableRoleOptions[0].value);
    cancelNewUserInvite(items[item].id);
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your new user invites: ' + error.message;
  }

  return (
    <form>
      {userLimitReached && (
        <Typography margin="1rem 0">
          You have reached the maximum number of users for your current plan. To add more users, consider upgrading your
          plan.
        </Typography>
      )}
      {!userLimitReached && (
        <>
          <Typography margin="1rem 0">
            Send an invite to add admins or viewers to Invotastic.
          </Typography>
          <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
            <TextField
              id="admin-email"
              label="Admin Email"
              type="email"
              variant="standard"
              fullWidth
              spellCheck={false}
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
            />
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
            <InputLabel id="assigned-role-label">Assigned Role</InputLabel>
            <Select
              labelId="assigned-role-label"
              id="assigned-role"
              value={assignedRole}
              onChange={(event) => {
                setAssignedRole(event.target.value);
              }}
            >
              {!!assignableRoleOptions.length &&
                assignableRoleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
            <Button
              fullWidth
              variant="contained"
              disabled={isFetching || !adminEmail || !assignedRole}
              onClick={inviteUser}
            >
              INVITE
            </Button>
          </Container>
        </>
      )}
      {!userLimitReached && hasExistingInvite && (
        <>
          <Typography margin="1rem 0">
            The invitation email has been sent to:
          </Typography>

          <Box sx={{ margin: '1rem 0' }}>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>

                {/* Display the email */}
                <Typography component="span">
                  <strong>{item.email}</strong>
                </Typography>

                {/* Cancel button for the specific item */}
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => cancelInvite(index)} 
                  disabled={isFetching}
                >
                  CANCEL
                </Button>
              </Box>
            ))}
          </Box>

        </>
      )}
    </form>
  );
}
