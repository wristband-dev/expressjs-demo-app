'use strict';

const express = require('express');

const tokenController = require('../../controllers/token-controller');

const router = express.Router();

// Token Endpoint: Retrieves an access token and its expiration time to store in Wristband's react-client-auth SDK.
// Calling Wrisband's React SDK getToken() function calls this endpoint when there is no access token present in
// the React SDK client-side cache.
router.get('/token', tokenController.getToken);

module.exports = router;
