import React, { useState } from 'react';
import { Button, Container, FormControl, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';

import { sessionHooks, settingsHooks } from 'hooks';

export function ProfileSettingsForm() {
  const { data: user, error, isFetching, isInitialLoading } = sessionHooks.useSessionUser();
  const { mutate: updateUser } = settingsHooks.useUpdateUser();

  const [firstName, setFirstName] = useState(user.givenName ?? '');
  const [lastName, setLastName] = useState(user.familyName ?? '');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const flexInputPadding = isSmall ? '0.5rem' : '0';

  const updateUserInfo = () => updateUser({ id: user.id, givenName: firstName, familyName: lastName });

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your user: ' + error.message;
  }

  return (
    <form>
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="first-name"
              label="First Name"
              type="text"
              variant="standard"
              required
              fullWidth
              spellCheck={false}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="last-name"
              label="Last Name"
              type="text"
              variant="standard"
              required
              fullWidth
              spellCheck={false}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
        <Button variant="contained" fullWidth disabled={isFetching} onClick={updateUserInfo}>
          SAVE
        </Button>
      </Container>
    </form>
  );
}
