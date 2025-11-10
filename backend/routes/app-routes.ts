import express from 'express';
import { body, param } from 'express-validator';

import * as demoController from '../controllers/demo-controller';
import * as wristbandController from '../controllers/wristband-controller';
import requireJwt from '../middleware/require-jwt';
import { InvoiceStatus } from '../types/invoice';
import { requireWristbandAuth } from '../wristband';

const router = express.Router();

/**
 * This protected endpoint only requires a valid Bearer token in the Authorization request header.
 */
/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
router.get('/hello-world', requireJwt, demoController.getHelloWorld);

////////////////////////////////////////////////////////
// EVERY PROTECTED ROUTE BELOW REQUIRES SESSION AUTH
////////////////////////////////////////////////////////

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
router.use(requireWristbandAuth);

/**
 * Endpoints that call to Wristband APIs after the user is authenticated.
 */
router.get('/user-info', wristbandController.getUser);
router.get('/role-info', wristbandController.getRole);
router.get('/company-info', wristbandController.getTenant);
router.get('/assignable-role-options', wristbandController.queryTenantRoles);
router.patch(
  '/users/:userId',
  [
    param('userId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
    body('givenName')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 200 })
      .withMessage('too-long(200)'),
    body('familyName')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 200 })
      .withMessage('too-long(200)'),
  ],
  wristbandController.updateUser
);
router.get('/new-user-invitation-requests', wristbandController.queryNewUserInvitations);
router.post(
  '/invite-new-user',
  [
    body('email')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 200 })
      .withMessage('too-long(200)')
      .isEmail()
      .withMessage('bad-pattern'),
    body('roleId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
  ],
  wristbandController.inviteNewUser
);
router.post(
  '/cancel-new-user-invite',
  [
    body('requestId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
  ],
  wristbandController.cancelNewUserInvite
);

/**
 * Demo-specific resource APIs. These controllers may make request to Wristband APIs in order
 * to complete permission and resource checks as part of the logic.
 */
router.post(
  '/invoices',
  [
    body('companyId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
    body('customerName')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 100 })
      .withMessage('too-long(100)'),
    body('customerEmail')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 100 })
      .withMessage('too-long(100)')
      .normalizeEmail()
      .isEmail()
      .withMessage('invalid-email'),
    body('totalDue').exists().withMessage('null').isFloat({ min: 0.0, locale: 'en-US' }).withMessage('invalid-float'),
  ],
  demoController.createInvoice
);
router.put(
  '/invoices/:invoiceId',
  [
    param('invoiceId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
    body('status')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .custom((value: string) => {
        return Object.values(InvoiceStatus).includes(value as InvoiceStatus);
      })
      .withMessage('invalid-enum'),
  ],
  demoController.updateInvoice
);
router.get(
  '/companies/:companyId/invoices',
  [
    param('companyId')
      .exists()
      .withMessage('null')
      .isString()
      .withMessage('not-string')
      .trim()
      .not()
      .isEmpty()
      .withMessage('blank')
      .isLength({ max: 26 })
      .withMessage('too-long(26)'),
  ],
  demoController.getInvoicesByCompany
);

export default router;
