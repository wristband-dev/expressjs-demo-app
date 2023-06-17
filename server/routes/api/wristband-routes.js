'use strict';

const express = require('express');
const { body, param } = require('express-validator');

const wristbandController = require('../../controllers/wristband-controller');
const { States } = require('../../utils/constants');

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
    body('email')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 150 }).withMessage('too-long(150)')
      .isEmail().withMessage('bad-pattern'),
    body('emailVerified')
      .optional()
      .isBoolean().withMessage('not-boolean'),
    body('pendingNewEmail')
      .optional({ checkNull: true, checkFalsy: true, nullable: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 150 }).withMessage('too-long(150)')
      .isEmail().withMessage('bad-pattern'),
    body('username')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('status')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 45 }).withMessage('too-long(45)'),
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
    body('fullName')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('phoneNumber')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 20 }).withMessage('too-long(20)'),
    body('birthdate')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 10 }).withMessage('too-long(10)'),
  ],
  wristbandController.updateUser
);

router.get('/change-email-requests', wristbandController.queryChangeEmailRequests);

// prettier-ignore
router.post(
  '/request-email-change',
  [
    body('newEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)')
      .isEmail().withMessage('bad-pattern'),
  ],
  wristbandController.requestEmailChange
);

// prettier-ignore
router.post(
  '/cancel-email-change',
  [
    body('requestId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)')
  ],
  wristbandController.cancelEmailChange
);

// prettier-ignore
router.post(
  '/change-password',
  [
    body('currentPassword')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank'),
    body('newPassword')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
  ],
  wristbandController.changePassword
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

// prettier-ignore
router.get(
  '/companies/:companyId',
  [
    param('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)')
  ],
  wristbandController.getCompany
);

// prettier-ignore
router.put(
  '/companies/:companyId',
  [
    param('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('displayName')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('invoiceEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)')
      .normalizeEmail()
      .isEmail().withMessage('invalid-email'),
    body('address')
      .exists().withMessage('null')
      .custom(value => {return typeof value === 'object'}).withMessage('invalid-state'),
    body('address.street1')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('address.street2')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('address.city')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('address.state')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .custom(value => {return States.includes(value)}).withMessage('invalid-state'),
    body('address.zipCode')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 10 }).withMessage('too-long(10)'),
  ],
  wristbandController.updateCompany
);

router.get('/user-count', wristbandController.getUserCount);

module.exports = router;
