import axios from 'axios';
import { redirectToLogin } from '@wristband/react-client-auth';

import { isUnauthorizedError, isForbiddenError } from 'utils';

const baseURL = `${window.location.origin}/api`;
const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

// This API client is used for most API calls to the Express server. It automatically sends users to the login
// page if they are not authenticated.
const apiClient = axios.create({
  baseURL,
  headers,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'CSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-TOKEN',
});

// Any HTTP 401s should trigger the user to go log in again.  This happens when their session cookie has expired
// and is missing in the request. You can optionally catch HTTP 403s as well.
apiClient.interceptors.response.use(undefined, async (error) => {
  if (isUnauthorizedError(error) || isForbiddenError(error)) {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    redirectToLogin('/api/auth/login');
  }

  return Promise.reject(error);
});

// This API client is used for API calls to the Express server that require an access token to be passed
// in the Authorization request header.
const apiClientWithJwt = axios.create({ baseURL, headers });

export { apiClient, apiClientWithJwt };
