import React, { useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';

import { CreateInvoiceDialog, InvoiceTable } from 'components';
import { invoiceHooks, sessionHooks } from 'hooks';
import { isOwnerRole } from 'utils';

export function HomePage() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const { data: role } = sessionHooks.useSessionRole();
  const { data: company } = sessionHooks.useSessionCompany();
  const { data: invoices, error, isInitialLoading: isInvoicesLoading } = invoiceHooks.useInvoices(company.id);

  if (isInvoicesLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your invoices: ' + error.message;
  }

  return (
    <Grid container maxWidth={1200} marginX="auto">
      <Grid item xs={12} marginTop="3rem" textAlign="center">
        <Typography fontSize="2rem">Send (fake) fantastic invoices.</Typography>
        <Typography sx={{ margin: '1rem auto 0', padding: '0 2rem', maxWidth: '800px', textAlign: 'left' }}>
          {`All API interactions on this page are protected with your session cookie and CSRF token. Only
          admins with the "Owner" role can create and cancel invoices.`}
        </Typography>
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12} marginY={4}>
            <CreateInvoiceDialog open={showCreateInvoice} handleClose={() => setShowCreateInvoice(false)} />
            <Container sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', width: '15rem' }}>
              <Button
                variant="contained"
                fullWidth
                /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
                disabled={!isOwnerRole(role.name)}
                onClick={() => setShowCreateInvoice(true)}
              >
                NEW INVOICE
              </Button>
            </Container>
            <Container sx={{ display: 'flex', justifyContent: 'center', margin: '3rem auto 0' }}>
              {invoices?.length > 0 ? (
                <InvoiceTable invoices={invoices} />
              ) : (
                <Container
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>
                    {"You don't have any invoices yet. Click the button above to create your first invoice."}
                  </Typography>
                </Container>
              )}
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    </Grid>
  );
}
