import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WristbandAuthProvider } from '@wristband/react-client-auth';

import { theme } from 'themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, { response }) => {
        if (['401', '403'].includes(response.status)) {
          return false;
        }
        return count < 3;
      },
      staleTime: 30000,
    },
  },
});

const initializeReactQuery = (sessionResponse) => {
  const { metadata } = sessionResponse;
  if (!metadata) {
    throw new Error('Session metadata was not returned as part of the Session Endpoint response.');
  }
  const { assignedRole, company, configs, user } = metadata;
  queryClient.setQueryData(['session-user'], user);
  queryClient.setQueryData(['session-role'], assignedRole);
  queryClient.setQueryData(['session-company'], company);
  queryClient.setQueryData(['session-configs'], configs);
};

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }} maxSnack={3}>
            {/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */}
            <WristbandAuthProvider
              loginUrl="/api/auth/login"
              logoutUrl="/api/auth/logout"
              sessionUrl="/api/v1/session-data"
              onSessionSuccess={initializeReactQuery}
            >
              {children}
            </WristbandAuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
