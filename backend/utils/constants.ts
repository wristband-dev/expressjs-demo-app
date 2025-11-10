// Authorization
export const FORBIDDEN_ACCESS = { code: 'FORBIDDEN', message: 'Forbidden access.' };
export const INVOICE_READ_PERM = 'invoice:read';
export const INVOICE_WRITE_PERM = 'invoice:write';

// Database
export const DATABASE_FILE = 'db.json';
export const INVOICES_SCHEMA = 'invoices';
export const DEFAULT_DB_DATA = { [INVOICES_SCHEMA]: [] };
