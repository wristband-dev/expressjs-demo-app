import React from 'react';
import { Navigate, Routes, Route } from 'react-router';
import { useWristbandAuth } from '@wristband/react-client-auth';

import { FullScreenSpinner, Navbar } from 'components';
import { AccessTokensPage, HomePage, SettingsPage } from 'pages';

// This demo app does not have any unprotected routes or pages.  If your app needed
// that functionality, then this is where you could add the unprotected routes.
function UnauthenticatedApp() {
  return <FullScreenSpinner />;
}

function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/tokens" element={<AccessTokensPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </>
  );
}

export function App() {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const { isAuthenticated } = useWristbandAuth();
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
