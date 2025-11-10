import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware that catches unhandled errors and returns a consistent error response.
 */
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error);

  if (error.stack) {
    console.error(error.stack);
  }

  if (res.headersSent) {
    return next(error); // Delegate to Express's default handler
  }

  return res.status(500).json({ code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred on our end.' });
}
