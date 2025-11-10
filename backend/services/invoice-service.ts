// NOTE: The local file DB library being used is synchronous.  To mimic a more realistic scenario where
// database access functions are asynchronous, all service functions are wrapped in promises.
// TODO: Upgrading to LowDB version 3 (asynchronous) requires switching to ES modules for the whole project...
import * as db from '../database/db';
import { Invoice } from '../types/invoice';

export async function getInvoice(invoiceId: string): Promise<Invoice | undefined> {
  return await Promise.resolve(db.getInvoice(invoiceId));
}

export async function getInvoicesForCompany(companyId: string): Promise<Invoice[]> {
  return await Promise.resolve(db.getInvoicesByCompany(companyId));
}

export async function createInvoice(invoiceData: Invoice): Promise<Invoice> {
  return await Promise.resolve(db.createInvoice(invoiceData));
}

export async function updateInvoice(invoiceData: Invoice): Promise<Invoice> {
  return await Promise.resolve(db.updateInvoice(invoiceData));
}
