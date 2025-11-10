import express from 'express';
import path from 'path';

import { errorHandler } from './middleware/error-handler';
import appRoutes from './routes/app-routes';
import authRoutes from './routes/auth-routes';
import { wristbandSession } from './wristband';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable encrypted cookie-based sessions with Wristband SDK
/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
app.use(wristbandSession());

// Registered routes for all server APIs
app.use('/api/auth', authRoutes);
app.use('/api/v1', appRoutes);

// Serve static assets if in production mode.
if (process.env.NODE_ENV === 'production') {
  console.info('Production ENV detected. Serving up static assets.');
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('{*catchAll}', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Catch-all for any unexpected server-side errors.
app.use(errorHandler);

export default app;
