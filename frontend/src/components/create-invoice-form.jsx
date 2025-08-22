import React, { useState } from 'react';
import { Button, FormControl, Grid, InputAdornment, TextField } from '@mui/material';

import { invoiceHooks, sessionHooks } from 'hooks';

export function CreateInvoiceForm({ closeFormDialog }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [totalDue, setTotalDue] = useState('');

  const { data: company } = sessionHooks.useSessionCompany();
  const { mutate: createInvoice, isSubmitting } = invoiceHooks.useCreateInvoice(closeFormDialog);

  // Only update if it's a positive integer
  const handleTotalDueChanged = (value) => {
    if (!value || !value.trim()) {
      setTotalDue('');
      return;
    }

    const normalizedValue = value.trim().replace(/\s+/g, '');
    if (/^[1-9]\d*$/.test(normalizedValue)) {
      setTotalDue(normalizedValue);
    }
  };

  const handleSubmit = () => {
    createInvoice({
      companyId: company.id,
      customerName,
      customerEmail,
      totalDue: parseFloat(totalDue).toFixed(2),
    });
  };

  return (
    <form>
      <Grid container margin="2rem auto" display="flex">
        <FormControl variant="standard" fullWidth>
          <TextField
            id="customer-name"
            label="Customer Name"
            type="text"
            variant="standard"
            autoComplete="off"
            fullWidth
            required
            spellCheck={false}
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid container margin="2rem auto" display="flex">
        <FormControl variant="standard" fullWidth>
          <TextField
            id="customer-email"
            label="Customer Email Address"
            type="email"
            variant="standard"
            autoComplete="off"
            fullWidth
            required
            spellCheck={false}
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid container margin="2rem auto" display="flex">
        <FormControl variant="standard" fullWidth>
          <TextField
            id="total-due"
            label="Total Due"
            type="text"
            variant="standard"
            autoComplete="off"
            fullWidth
            required
            spellCheck={false}
            value={totalDue}
            onChange={(event) => handleTotalDueChanged(event.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </FormControl>
      </Grid>
      <Button
        // Super crude form validation :o)
        disabled={!(customerName && customerEmail && totalDue) || isSubmitting}
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginTop: '2rem' }}
      >
        {isSubmitting ? 'SENDING...' : 'SEND INVOICE'}
      </Button>
    </form>
  );
}
