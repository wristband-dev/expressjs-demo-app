import { Grid, Typography } from '@mui/material';

import {
    TouchpointChip,
    CompanySettingsForm,
    CustomDivider,
    InviteUserForm,
  } from 'components';
  import { sessionHooks } from 'hooks';
  import { constants } from 'utils';
  
  export function AdminPage() {
    const { data: role } = sessionHooks.useSessionRole();
    const { data: sessionConfigs, error, isInitialLoading } = sessionHooks.useSessionConfigs();
  
    if (isInitialLoading) {
      return 'Loading...';
    }
  
    if (error) {
      return 'An error has occurred retrieving your session configs: ' + error.message;
    }
  
    return (
        <Grid container maxWidth={1200} marginX="auto">
          <Grid item xs={12} marginTop="2rem" textAlign="center">
            <Typography fontSize="2rem">Admin Portal</Typography>
          </Grid>

          <Grid container item xs={12} marginBottom="2rem">
            <Grid item xs={1} sm={2} />
            <Grid container item xs={10} sm={8}>
              {/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */}
              {role.name === constants.OWNER_ROLE && (
                <>
                  <Grid item xs={12}>
                    <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
                      Company
                    </Typography>
                    <TouchpointChip />
                    <CompanySettingsForm />
                  </Grid>
                  <Grid item xs={12} marginY={2}>
                    <CustomDivider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
                      Invite Admins
                    </Typography>
                    <TouchpointChip />
                    <InviteUserForm />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item xs={1} sm={2} />
          </Grid>
        </Grid>
      );
    }
    