'use strict';

const express = require('express');
const sessionController = require('../../controllers/session-controller');

const router = express.Router();

// Session data loaded upon app mount
router.get('/session-data', sessionController.sessionData);

// Session data loaded on-demand on a per-page/component basis, or on react-query cache refresh.
router.get('/user-info', sessionController.userinfo);
router.get('/role-info', sessionController.roleInfo);
router.get('/company-info', sessionController.companyInfo);
router.get('/session-configs', sessionController.sessionConfigs);
router.get('/assignable-role-options', sessionController.getAssignableRoleOptions);

module.exports = router;
