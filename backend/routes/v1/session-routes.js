'use strict';

const express = require('express');

const sessionController = require('../../controllers/session-controller');

const router = express.Router();

/**
 * Session Endpoint: Data loaded upon app mount and stored in Wristband's react-client-auth SDK cache.
 * This API is the entrypoint for the React SPA.
 */
router.get('/session', sessionController.session);

/**
 * Session data for React-Query: Data loaded on-demand per-page/component, or during React-Query cache refresh.
 * These endpoints are for demo purposes and are unrelated to Wristband SDKs.
 */
router.get('/user-info', sessionController.userinfo);
router.get('/role-info', sessionController.roleInfo);
router.get('/company-info', sessionController.companyInfo);
router.get('/assignable-role-options', sessionController.getAssignableRoleOptions);

module.exports = router;
