import React, { useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { redirectToLogin, useWristbandSession, useWristbandToken, WristbandError } from '@wristband/react-client-auth';

import { helloWorldService } from 'services';
import { sessionHooks } from 'hooks';
import { isOwnerRole } from 'utils';
import { isAxiosError } from 'axios';
import { ResponseBox } from 'components';

export function AccessTokensPage() {
  const [helloMsg, setHelloMsg] = useState('');
  const [helloJwtPayload, setHelloJwtPayload] = useState({});

  const { jwt, ...payload } = helloJwtPayload;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const { clearToken, getToken } = useWristbandToken();
  const { metadata } = useWristbandSession();

  const { data: role } = sessionHooks.useSessionRole();

  const getHelloWorld = async () => {
    try {
      const token = await getToken();
      const { message, jwtPayload } = await helloWorldService.fetchHelloWorld(token);
      setHelloMsg(`You said "${message}" at ${new Date().toString().split(' GMT')[0]}`);
      setHelloJwtPayload(jwtPayload);
    } catch (error) {
      clearToken();
      setHelloMsg('There was an error fetching a new access token!');
      setHelloJwtPayload({});

      if (error instanceof WristbandError || (isAxiosError(error) && [401, 403].includes(error.response.status))) {
        redirectToLogin('/api/auth/login', {
          tenantName: metadata?.company?.name || undefined,
          returnUrl: window.location.href,
        });
      } else {
        console.error(error);
      }
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
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            margin: '2rem auto',
            width: '15rem',
          }}
        >
          {/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */}
          <Button disabled={!isOwnerRole(role.name)} variant="contained" fullWidth onClick={getHelloWorld}>
            HELLO WORLD
          </Button>
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '2rem auto 0',
            maxWidth: '700px',
          }}
        >
          <Typography fontSize="1rem" fontWeight={700} padding="0.5rem" margin="0 auto">
            {helloMsg}
          </Typography>
          {Object.keys(helloJwtPayload).length > 0 && (
            <>
              <Box sx={{ margin: '0.5rem auto', width: '100%' }}>
                <ResponseBox title={'Your Access Token'} message={jwt} />
              </Box>
              <Box sx={{ margin: '0.5rem auto 2rem', width: '100%' }}>
                <ResponseBox title={'Your JWT Payload'} message={JSON.stringify(payload, null, 4)} />
              </Box>
            </>
          )}
        </Container>
      </Grid>
    </Grid>
  );
}
