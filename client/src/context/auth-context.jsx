import React, { createContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { sessionService } from 'services';
import { util } from 'utils';

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
        const sessionData = await sessionService.getInitialSessionData();
        const { assignedRole, company, configs, user } = sessionData;
        queryClient.setQueryData(['session-user'], user);
        queryClient.setQueryData(['session-role'], assignedRole);
        queryClient.setQueryData(['session-company'], company);
        queryClient.setQueryData(['session-configs'], configs);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        util.redirectToLogout();
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
