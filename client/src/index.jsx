import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WristbandAuthProvider } from '@wristband/react-client-auth';

import './index.css';
import { App } from 'app';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */}
          <WristbandAuthProvider
            loginUrl="/api/auth/login"
            logoutUrl="/api/auth/logout"
            sessionUrl="/api/v1/session"
            tokenUrl="/api/v1/token"
            // This function shows how you could combine an external state management library like React
            // Query (if desired) in combination with Wristband's React SDK.
            onSessionSuccess={(sessionResponse) => {
              const { metadata } = sessionResponse;
              if (!metadata) {
                throw new Error('Session metadata was not returned as part of Session Endpoint response.');
              }
              queryClient.setQueryData(['session-user'], metadata.user);
              queryClient.setQueryData(['session-role'], metadata.assignedRole);
              queryClient.setQueryData(['session-company'], metadata.company);
            }}
          >
            <App />
          </WristbandAuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
