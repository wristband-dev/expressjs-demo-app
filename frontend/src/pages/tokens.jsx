import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useWristbandToken } from '@wristband/react-client-auth';

import { helloWorldService } from 'services';
import { sessionHooks } from 'hooks';
import { isOwnerRole } from 'utils';

export function AccessTokensPage() {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const { clearToken, getToken } = useWristbandToken();

  const { data: role } = sessionHooks.useSessionRole();

  const getHelloWorld = async () => {
    try {
      const token = await getToken();
      const message = await helloWorldService.fetchHelloWorld(token);
      alert(message);
    } catch (error) {
      console.error(error);
      clearToken();
      alert('There was an error fetching a new access token!');
    }
  };

  return (
    <Grid container maxWidth={1200} marginX="auto">
      <Grid item xs={12} marginTop="3rem" textAlign="center">
        <Typography fontSize="2rem">Access Tokens</Typography>
        <Typography sx={{ margin: '1rem auto 0', padding: '0 2rem', maxWidth: '800px', textAlign: 'left' }}>
          {`In Wristband, you can secure resource APIs using either a session cookie (sent automatically by the
          browser) or an access token sent manually in the request. The useWristbandToken() hook from the React SDK
          provides a way to fetch and cache a token within the React SDK by using the getToken() function. This button
          calls to a protected endpoint that expects a valid access token. Only admins with the "Owner" role can test
          access tokens.`}
        </Typography>
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto 0', width: '15rem' }}>
          {/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */}
          <Button disabled={!isOwnerRole(role.name)} variant="contained" fullWidth onClick={getHelloWorld}>
            HELLO WORLD
          </Button>
        </Container>
      </Grid>
    </Grid>
  );
}
