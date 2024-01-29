'use strict';

exports.IS_LOCALHOST = process.env.DOMAIN_FORMAT === 'LOCALHOST';
exports.INVOTASTIC_HOST = this.IS_LOCALHOST ? 'localhost:6001' : 'business.invotastic.com:6001';
const authCallbackTenantDomain = this.IS_LOCALHOST ? '' : '{tenant_domain}.';

exports.APPLICATION_LOGIN_URL = `https://${process.env.APPLICATION_DOMAIN}/login`;
exports.AUTH_CALLBACK_URL = `http://${authCallbackTenantDomain}${this.INVOTASTIC_HOST}/api/auth/callback`;
exports.BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  auth: { username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET },
};
exports.CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.LOGIN_STATE_COOKIE_PREFIX = 'login:';
exports.LOGIN_STATE_COOKIE_SECRET = '7ffdbecc-ab7d-4134-9307-2dfcc52f7475';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'sid';
exports.SESSION_COOKIE_SECRET = '96bf13d5-b5c1-463a-812c-0d8db87c0ec5';
exports.TRUST_SELF_SIGNED_CERT = false;

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
