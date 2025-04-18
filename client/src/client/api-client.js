import axios from 'axios';
import { redirectToLogin } from '@wristband/react-client-auth';

import { isUnauthorizedError, isForbiddenError } from 'utils/auth';

/* CSRF_TOUCHPOINT */
const apiClient = axios.create({
  baseURL: `${window.location.origin}/api`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// Any HTTP 401s should trigger the user to go log in again.  This happens when their
// session cookie has expired and/or the CSRF cookie/header are missing in the request.
// You can optionally catch HTTP 403s as well.
const unauthorizedAccessInterceptor = async (error) => {
  if (isUnauthorizedError(error) || isForbiddenError(error)) {
    redirectToLogin('/api/auth/login');
  }

  return Promise.reject(error);
};

apiClient.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

export { apiClient };
