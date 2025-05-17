'use strict';

exports.CSRF_TOKEN_COOKIE_NAME = 'CSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.INVOTASTIC_HOST = 'localhost:6001';
exports.LOGIN_STATE_COOKIE_SECRET = 'dummyval-ab7d-4134-9307-2dfcc52f7475';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'session';
exports.SESSION_COOKIE_SECRET = 'dummyval-b5c1-463a-812c-0d8db87c0ec5';
exports.TRUST_SELF_SIGNED_CERT = true;
exports.WRISTBAND_IDP_NAME = 'wristband';

exports.InvoiceTerms = Object.freeze({
  DUE_ON_RECEIPT: 'DUE_ON_RECEIPT',
  NET_7: 'NET_7',
  NET_15: 'NET_15',
  NET_30: 'NET_30',
});
exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED' });
exports.States = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CZ',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];
