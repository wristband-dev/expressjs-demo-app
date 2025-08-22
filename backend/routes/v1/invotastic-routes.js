'use strict';

const express = require('express');
const { body, param } = require('express-validator');

const { InvoiceStatus } = require('../../utils/constants');
const invotasticController = require('../../controllers/invotastic-controller');

const router = express.Router();

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
      .isFloat({ min: 0.00, locale: 'en-US' }).withMessage('invalid-float'),
  ],
  invotasticController.createInvoice
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
      .custom(value => {return InvoiceStatus[value]}).withMessage('invalid-enum'),
  ],
  invotasticController.updateInvoice
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
      .isLength({ max: 26 }).withMessage('too-long(26)')
  ],
  invotasticController.getInvoicesByCompany
);

module.exports = router;
