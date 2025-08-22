import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invoiceService } from 'services';

export const useInvoices = (companyId) => {
  return useQuery(['invoices'], () => invoiceService.fetchInvoices(companyId), { placeholderData: [] });
};

export const useCreateInvoice = (closeFormDialog) => {
  const queryClient = useQueryClient();

  return useMutation(invoiceService.createInvoice, {
    onSuccess: () => {
      closeFormDialog();
      queryClient.invalidateQueries('invoices');
      alert('Invoice created successfully.');
    },
    onError: (error) => {
      console.log(error);
      alert(error.response.data.code);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation(invoiceService.updateInvoice, {
    onSuccess: () => alert('Invoice updated successfully.'),
    onMutate: async () => await queryClient.cancelQueries('invoices'),
    onError: (error) => {
      console.log(error);
      alert(error.response.data.code);
    },
    onSettled: () => queryClient.invalidateQueries('invoices'),
  });
};
