import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { settingsHooks } from 'hooks';

export function InviteUserForm() {
  const [assignedRole, setAssignedRole] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const { data: assignableRoleOptions } = settingsHooks.useAssignableRoleOptions();
  const { data: invites, error, isFetching, isInitialLoading } = settingsHooks.useNewUserInvites();
  const { mutate: cancelNewUserInvite } = settingsHooks.useCancelNewUserInvite();
  const { mutate: createNewUserInvite } = settingsHooks.useCreateNewUserInvite();
  const { items, totalResults } = invites;
  const hasExistingInvite = totalResults > 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const flexInputPadding = isSmall ? '0.5rem' : '0';

  useEffect(() => {
    if (!!assignableRoleOptions.length && !assignedRole) {
      setAssignedRole(assignableRoleOptions[0].value);
    }
  }, [assignableRoleOptions, assignableRoleOptions.length, assignedRole]);

  const inviteUser = () => {
    createNewUserInvite(
      { email: adminEmail, roleId: assignedRole },
      {
        onSuccess: () => {
          // Clear the admin email text box after the invite is successfully sent
          setAdminEmail('');
        },
      }
    );
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
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
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
        </Grid>
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="assigned-role-label">Assigned Role</InputLabel>
            <Select
              labelId="assigned-role-label"
              id="assigned-role"
              value={assignedRole}
              onChange={(event) => setAssignedRole(event.target.value)}
            >
              {!!assignableRoleOptions.length &&
                assignableRoleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
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
      {hasExistingInvite && (
        <>
          <Typography margin="1rem 0">An invitation email has been sent to:</Typography>
          <Box sx={{ margin: '1rem 0' }}>
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Display the email */}
                <Typography component="span" sx={{ wordBreak: 'break-word' }}>
                  <strong>{item.email}</strong>
                </Typography>

                {/* Cancel button for the specific item */}
                <Button variant="contained" color="secondary" onClick={() => cancelInvite(index)} disabled={isFetching}>
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
