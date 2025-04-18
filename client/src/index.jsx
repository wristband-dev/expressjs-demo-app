import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { App } from 'app';
import { AppProviders } from 'providers/app-providers';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
