import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeApi, type ListChargesParams, type ListTransactionsParams } from './api';
import { toast } from '../../stores/toast.store';
import type { PaymentMethod } from '../../api/types';

export function useMyCharges() {
  return useQuery({ queryKey: ['finance', 'my-charges'], queryFn: financeApi.myCharges });
}

export function useMemberCharges(memberId: string | undefined) {
  return useQuery({
    queryKey: ['finance', 'member-charges', memberId],
    queryFn: () => financeApi.memberCharges(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useCharges(params: ListChargesParams) {
  return useQuery({ queryKey: ['finance', 'charges', params], queryFn: () => financeApi.listCharges(params), placeholderData: (p) => p });
}

export function useFeeRules() {
  return useQuery({ queryKey: ['finance', 'fee-rules'], queryFn: financeApi.listFeeRules });
}

export function useCategories() {
  return useQuery({ queryKey: ['finance', 'categories'], queryFn: financeApi.listCategories });
}

export function useTransactions(params: ListTransactionsParams) {
  return useQuery({ queryKey: ['finance', 'transactions', params], queryFn: () => financeApi.listTransactions(params), placeholderData: (p) => p });
}

export function useFinanceSummary(from?: string, to?: string) {
  return useQuery({ queryKey: ['finance', 'summary', from, to], queryFn: () => financeApi.summary(from, to) });
}

function useInvalidateFinance() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['finance'] });
}

export function useCreateCharge() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.createCharge,
    onSuccess: () => {
      invalidate();
      toast.success('Cobrança criada.');
    },
  });
}

export function useGenerateMonth() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.generateMonth,
    onSuccess: (data) => {
      invalidate();
      toast.success(`${data.created} cobrança(s) gerada(s) para o mês.`);
    },
  });
}

export function useRegisterPayment() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod: PaymentMethod }) => financeApi.registerPayment(id, { paymentMethod }),
    onSuccess: () => {
      invalidate();
      toast.success('Pagamento registrado.');
    },
  });
}

export function useWaiveCharge() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => financeApi.waiveCharge(id, reason),
    onSuccess: () => {
      invalidate();
      toast.success('Cobrança isentada.');
    },
  });
}

export function useCancelCharge() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => financeApi.cancelCharge(id, reason),
    onSuccess: () => {
      invalidate();
      toast.success('Cobrança cancelada.');
    },
  });
}

export function useCreateFeeRule() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.createFeeRule,
    onSuccess: () => {
      invalidate();
      toast.success('Regra de mensalidade criada.');
    },
  });
}

export function useRemoveFeeRule() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.removeFeeRule,
    onSuccess: () => {
      invalidate();
      toast.success('Regra removida.');
    },
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.createCategory,
    onSuccess: () => {
      invalidate();
      toast.success('Categoria criada.');
    },
  });
}

export function useRemoveCategory() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.removeCategory,
    onSuccess: () => {
      invalidate();
      toast.success('Categoria removida.');
    },
    onError: () => toast.error('Não foi possível remover esta categoria.'),
  });
}

export function useCreateTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.createTransaction,
    onSuccess: () => {
      invalidate();
      toast.success('Lançamento registrado.');
    },
  });
}

export function useRemoveTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeApi.removeTransaction,
    onSuccess: () => {
      invalidate();
      toast.success('Lançamento removido.');
    },
  });
}
