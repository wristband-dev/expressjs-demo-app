'use strict';

exports.CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.INVOTASTIC_HOST = process.env.DOMAIN_FORMAT === 'LOCALHOST' ? 'localhost:6001' : 'business.invotastic.com:6001';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'sid';
exports.SESSION_COOKIE_SECRET = '96bf13d5-b5c1-463a-812c-0d8db87c0ec5';
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
