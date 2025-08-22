'use strict';

const axios = require('axios');
const Agent = require('agentkeepalive');
const https = require('node:https');

const JSON_MEDIA_TYPE = 'application/json;charset=UTF-8';

const apiClient = axios.create({
  baseURL: `https://${process.env.APPLICATION_VANITY_DOMAIN}/api/v1`,
  httpAgent: new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
    keepAlive: true,
  }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

module.exports = apiClient;
