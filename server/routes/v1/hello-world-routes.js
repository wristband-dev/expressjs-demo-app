'use strict';

const express = require('express');

const helloWorldController = require('../../controllers/hello-world-controller');

const router = express.Router();

// This endpoint is protected by having a Bearer token in the Authorization request header.
router.get('/hello-world', helloWorldController.getHelloWorld);

module.exports = router;
