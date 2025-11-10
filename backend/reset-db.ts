import fs from 'fs';

import { DATABASE_FILE, DEFAULT_DB_DATA } from './utils/constants';

const SCHEMA_DATA = JSON.stringify(DEFAULT_DB_DATA, null, 2);

fs.writeFile(DATABASE_FILE, SCHEMA_DATA, (err) => {
  if (err) {
    throw err;
  }

  console.log('The following schemas have been reset: ["invoices"]');
});
