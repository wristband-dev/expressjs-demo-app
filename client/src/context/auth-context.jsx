import React, { createContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { isUnauthorizedError, isForbiddenError, redirectToLogin, redirectToLogout } from 'utils/auth';

const authProviderClient = axios.create({
  baseURL: `${window.location.origin}/api`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withXSRFToken: true,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

const AuthContext = createContext({ isAuthenticated: false });

function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Bootstrap the application with the authenticated user's session data.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
        // We make one call to load all session data to reduce network requests, and then split up the
        // results into separate cache keys since each key could read/write indepenently of each other.
        // const sessionData = await sessionService.getInitialSessionData();
        const response = await authProviderClient.get('/v1/session-data');

        const { assignedRole, company, configs, user } = response.data;
        queryClient.setQueryData(['session-user'], user);
        queryClient.setQueryData(['session-role'], assignedRole);
        queryClient.setQueryData(['session-company'], company);
        queryClient.setQueryData(['session-configs'], configs);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        // Don't call logout on 401/403 to preserve the current page for when the user returns after re-authentication.
        isUnauthorizedError(error) || isForbiddenError(error) ? await redirectToLogin() : await redirectToLogout();
      }
    };

    fetchSession();
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// React context responsbile for establishing that the user is authenticated and getting session data.
// "AuthProvider" should wrap your App component to enable access to the "useAuth" hook everywhere.
// That hook can then be used to protect App routes.
export { AuthProvider, useAuth };
