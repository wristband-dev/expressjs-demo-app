'use strict';

const express = require('express');
const { body, param } = require('express-validator');

const wristbandController = require('../../controllers/wristband-controller');

const router = express.Router();

// prettier-ignore
router.patch(
  '/users/:userId',
  [
    param('userId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('givenName')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('familyName')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
  ],
  wristbandController.updateUser
);

router.get('/new-user-invitation-requests', wristbandController.queryNewUserInvitations);

// prettier-ignore
router.post(
  '/invite-new-user',
  [
    body('email')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)')
      .isEmail().withMessage('bad-pattern'),
    body('roleId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
  ],
  wristbandController.inviteNewUser
);

// prettier-ignore
router.post(
  '/cancel-new-user-invite',
  [
    body('requestId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)')
  ],
  wristbandController.cancelNewUserInvite
);

module.exports = router;
