import React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import { invoiceHooks, sessionHooks } from 'hooks';
import { isOwnerRole } from 'utils';

export function InvoiceTable({ invoices = [] }) {
  const { data: role } = sessionHooks.useSessionRole();
  const { mutate: cancelInvoice } = invoiceHooks.useUpdateInvoice();
  const isAdmin = isOwnerRole(role.name);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="invoice table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Customer</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{invoice.invoiceDate}</TableCell>
              <TableCell align="left">{invoice.customerName}</TableCell>
              <TableCell align="left">{invoice.customerEmail}</TableCell>
              <TableCell align="left">{'$ ' + invoice.totalDue}</TableCell>
              <TableCell align="left">{invoice.status.toUpperCase()}</TableCell>
              <TableCell align="center">
                {invoice.status !== 'CANCELLED' && (
                  <IconButton
                    color="error"
                    aria-label="Cancel Invoice"
                    title={isAdmin ? 'Cancel Invoice' : 'Only admins can cancel invoices.'}
                    /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
                    disabled={!isAdmin}
                    onClick={() => cancelInvoice({ id: invoice.id, status: 'CANCELLED' })}
                  >
                    <DoNotDisturbIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
