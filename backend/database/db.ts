import lowDb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { randomBytes } from 'crypto';

import { Database } from 'types/db';
import { Invoice } from 'types/invoice';
import { DATABASE_FILE, DEFAULT_DB_DATA, INVOICES_SCHEMA } from '../utils/constants';

const adapter = new FileSync<Database>(DATABASE_FILE);
const db = lowDb(adapter);
db.defaults(DEFAULT_DB_DATA).write();

// //////////////////////////////
//  INVOICES
// //////////////////////////////

export function getInvoice(invoiceId: string): Invoice | undefined {
  return db.get(INVOICES_SCHEMA).find({ id: invoiceId }).value();
}

export function createInvoice(newInvoice: Invoice): Invoice {
  const id = randomBytes(8).toString('hex');
  const invoiceWithId: Invoice = { ...newInvoice, id } as Invoice;
  db.get(INVOICES_SCHEMA).push(invoiceWithId).write();
  return invoiceWithId;
}

export function updateInvoice(updatedInvoice: Invoice): Invoice {
  db.get(INVOICES_SCHEMA).find({ id: updatedInvoice.id }).assign(updatedInvoice).write();
  return updatedInvoice;
}

export function getInvoicesByCompany(companyId: string): Invoice[] {
  return db.get(INVOICES_SCHEMA).filter({ companyId }).value();
}
