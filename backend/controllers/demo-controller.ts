import { Request, Response, NextFunction } from 'express';

import * as invoiceService from '../services/invoice-service';
import * as wristbandService from '../services/wristband-service';
import { reqValidation } from '../utils/validation';
import { FORBIDDEN_ACCESS, INVOICE_READ_PERM, INVOICE_WRITE_PERM } from '../utils/constants';
import { bearerToken, hasAccessToApi } from '../utils/util';
import { InvoiceStatus } from '../types/invoice';

export async function getHelloWorld(req: Request, res: Response) {
  return res.status(200).json({ message: 'Hello World!', jwtPayload: req.auth });
}

export async function createInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
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
      return res.status(403).json(FORBIDDEN_ACCESS);
    }
    if (companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS);
    }

    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const existingCompany = await wristbandService.getTenant(companyId, bearerToken(req));
    if (!existingCompany) {
      return res.status(400).json({ code: 'INVALID_REQUEST', message: 'Company could not be found.' });
    }

    const createdInvoice = await invoiceService.createInvoice({
      ...req.body,
      invoiceDate: new Date().toISOString().split('T')[0],
      status: InvoiceStatus.SENT,
      createdBy: userId,
    });
    return res.status(201).json(createdInvoice);
  } catch (error) {
    return next(error);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
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
      return res.status(403).json(FORBIDDEN_ACCESS);
    }
    const existingInvoice = await invoiceService.getInvoice(invoiceId);
    if (!existingInvoice) {
      return res.status(404).send({ code: 'NOT_FOUND', message: 'Invoice could not be found' });
    }
    if (existingInvoice.companyId !== tenantId) {
      return res.status(403).json(FORBIDDEN_ACCESS);
    }

    const updatedInvoice = await invoiceService.updateInvoice({ ...existingInvoice, ...req.body });
    return res.status(200).json(updatedInvoice);
  } catch (error) {
    return next(error);
  }
}

export async function getInvoicesByCompany(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
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
      return res.status(403).json(FORBIDDEN_ACCESS);
    }

    const invoices = await invoiceService.getInvoicesForCompany(companyId);
    return res.status(200).json(invoices);
  } catch (error) {
    return next(error);
  }
}
