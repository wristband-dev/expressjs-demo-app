import React from 'react';
import { Grid, Typography } from '@mui/material';

import { TouchpointChip, ProfileSettingsForm, InviteUserForm } from 'components';
import { sessionHooks } from 'hooks';
import { isOwnerRole } from 'utils';

const PROTECTION_MESSAGE =
  'All API interactions on this page are protected with your session cookie.' +
  'Only admins with the "Owner" role can invite admins.';

export function SettingsPage() {
  const { data: company } = sessionHooks.useSessionCompany();
  const { data: role } = sessionHooks.useSessionRole();
  const { data: user } = sessionHooks.useSessionUser();

  return (
    <Grid container maxWidth={1200} marginX="auto">
      <Grid item xs={12} marginTop="3rem" textAlign="center">
        <Typography fontSize="2rem">Settings</Typography>
        <Typography sx={{ margin: '1rem auto 0', padding: '0 2rem', maxWidth: '800px', textAlign: 'left' }}>
          {PROTECTION_MESSAGE}
        </Typography>
      </Grid>
      <Grid container item xs={12} margin="1rem 0 2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12}>
            <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
              Profile
            </Typography>
            <TouchpointChip />
            <Typography fontSize="0.875rem" fontWeight={700} margin="1rem 0 0.5rem">
              {`Email: ${user.email}`}
            </Typography>
            <ProfileSettingsForm />
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
              Invite Admins
            </Typography>
            <TouchpointChip />
            <Typography fontSize="0.875rem" fontWeight={700} margin="1rem 0 0.5rem">
              {`Company: ${company.displayName}`}
            </Typography>
            {/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */}
            {isOwnerRole(role.name) ? (
              <InviteUserForm />
            ) : (
              <Typography marginTop="2rem">{'Must have the "Owner" role to invite other users!'}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    </Grid>
  );
}
