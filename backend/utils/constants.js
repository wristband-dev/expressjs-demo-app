'use strict';

exports.APP_HOST = 'localhost:6001';
exports.CSRF_TOKEN_COOKIE_NAME = 'CSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'session';

exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED' });
