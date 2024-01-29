'use strict';

const invotasticService = require('../services/invotastic-service');
const wristbandService = require('../services/wristband-service');
const { reqValidation } = require('../utils/validation');
const {
  FORBIDDEN_ACCESS_RESPONSE,
  INVALID_REQUEST,
  INVOICE_READ_PERM,
  INVOICE_WRITE_PERM,
  NOT_FOUND,
  InvoiceStatus,
} = require('../utils/constants');
const { addressToTextBlock, bearerToken, hasAccessToApi } = require('../utils/util');

exports.createInvoice = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { tenantId, userId } = req.session;
  const { companyId } = req.body;
  const requiredPermissions = [INVOICE_WRITE_PERM];

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
    // Ensure the user has permission to write invoice data
    const currentPermissions = await wristbandService.getPermissionInfo(requiredPermissions, bearerToken(req));
    if (!hasAccessToApi(requiredPermissions, currentPermissions) || companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
    }
    if (companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
    }

    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const existingCompany = await wristbandService.getTenant(companyId, bearerToken(req));
    if (!existingCompany) {
      return res.status(400).json({ code: INVALID_REQUEST, message: 'Company could not be found.' });
    }

    const { address, invoiceEmail } = existingCompany;
    const createdInvoice = await invotasticService.createInvoice({
      ...req.body,
      fromEmail: invoiceEmail,
      fromAddress: addressToTextBlock(address),
      status: InvoiceStatus.SENT,
      createdBy: userId,
    });
    return res.status(201).json(createdInvoice);
  } catch (error) {
    return next(error);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { tenantId } = req.session;
  const { invoiceId } = req.params;
  const requiredPermissions = [INVOICE_WRITE_PERM];

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
    // Ensure the user has permission to write invoice data
    const currentPermissions = await wristbandService.getPermissionInfo(requiredPermissions, bearerToken(req));
    if (!hasAccessToApi(requiredPermissions, currentPermissions)) {
      return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
    }
    const existingInvoice = await invotasticService.getInvoice(invoiceId);
    if (!existingInvoice) {
      return res.status(404).send({ code: NOT_FOUND, message: 'Invoice could not be found' });
    }
    if (existingInvoice.companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
    }

    const updatedInvoice = await invotasticService.updateInvoice({ ...existingInvoice, ...req.body });
    return res.status(200).json(updatedInvoice);
  } catch (error) {
    return next(error);
  }
};

exports.getInvoicesByCompany = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { tenantId } = req.session;
  const { companyId } = req.params;
  const requiredPermissions = [INVOICE_READ_PERM];

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
    // Ensure the user has permission to read invoice data
    const currentPermissions = await wristbandService.getPermissionInfo(requiredPermissions, bearerToken(req));
    if (!hasAccessToApi(requiredPermissions, currentPermissions) || companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
    }

    const invoices = await invotasticService.getInvoicesForCompany(companyId);
    return res.status(200).json(invoices);
  } catch (error) {
    return next(error);
  }
};
