import express from 'express';
import { body, param } from 'express-validator';

import * as demoController from '../controllers/demo-controller';
import * as wristbandController from '../controllers/wristband-controller';
import { InvoiceStatus } from '../types/invoice';
import { requireWristbandAuth } from '../wristband';

const router = express.Router();

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// Every route below this middleware is protected. You could also place this middleware
// on specific routes if you need more granular auth.
router.use(requireWristbandAuth);

/**
 * Endpoints that call to Wristband APIs after the user is authenticated.
 */
router.get('/user-info', wristbandController.getUser);
router.get('/role-info', wristbandController.getRole);
router.get('/company-info', wristbandController.getTenant);
router.get('/assignable-role-options', wristbandController.queryTenantRoles);
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
      .optional({ nullable: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('familyName')
      .optional({ nullable: true, checkFalsy: true })
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
      .isString()
      .withMessage('not-string')
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
      .isLength({ max: 26 }).withMessage('too-long(26)'),
  ],
  wristbandController.cancelNewUserInvite
);

/**
 * This is the only protected API that will pass JWT auth strategy.
 */
router.get('/hello-world', demoController.getHelloWorld);

/**
 * Demo-specific resource APIs. These controllers may make request to Wristband APIs in order
 * to complete permission and resource checks as part of the logic.
 */
// prettier-ignore
router.post(
  '/invoices',
  [
    body('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('customerName')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('customerEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)')
      .normalizeEmail()
      .isEmail().withMessage('invalid-email'),
    body('totalDue')
      .exists().withMessage('null')
      .isFloat({ min: 0.0, locale: 'en-US' }).withMessage('invalid-float'),
  ],
  demoController.createInvoice
);
// prettier-ignore
router.put(
  '/invoices/:invoiceId',
  [
    param('invoiceId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('status')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .custom((value: string) => {
        return Object.values(InvoiceStatus).includes(value as InvoiceStatus);
      }).withMessage('invalid-enum'),
  ],
  demoController.updateInvoice
);
// prettier-ignore
router.get(
  '/companies/:companyId/invoices',
  [
    param('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
  ],
  demoController.getInvoicesByCompany
);

export default router;
