import { apiClientWithJwt } from 'client';

const bearerToken = (accessToken) => {
  if (!accessToken) {
    throw new Error('A valid access token must be provided');
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

export const fetchHelloWorld = async function (accessToken) {
  const response = await apiClientWithJwt.get(`/v1/hello-world`, bearerToken(accessToken));
  return response.data.message;
};
