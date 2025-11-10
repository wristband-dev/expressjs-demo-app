export enum InvoiceStatus {
  SENT = 'SENT',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
  DRAFT = 'DRAFT',
}

export interface Invoice {
  id: string;
  companyId: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: string;
  totalDue: string;
  status: InvoiceStatus;
  createdBy: string;
  message?: string;
}
