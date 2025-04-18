import { AxiosError } from 'axios';

function isHttpStatusError(error, statusCode) {
  if (error === null || error === undefined) {
    throw new TypeError('Argument [error] cannot be null or undefined');
  }

  // Handle Axios error format
  if (error instanceof AxiosError) {
    return error.response?.status === statusCode;
  }

  // Handle fetch Response objects
  if (error instanceof Response) {
    return error.status === statusCode;
  }

  throw new TypeError(
    `Invalid error type: Expected either an AxiosError or a Response object, but received type: [${typeof error}] `
  );
}

export const isUnauthorizedError = (error) => isHttpStatusError(error, 401);

export const isForbiddenError = (error) => isHttpStatusError(error, 403);
