import { http } from '../../api/http';
import type {
  Charge,
  ChargeStatus,
  FinancialCategory,
  FinancialTransaction,
  FinanceSummary,
  MembershipFeeRule,
  Paginated,
  PaymentMethod,
  TransactionType,
} from '../../api/types';

export interface ListChargesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ChargeStatus;
  memberId?: string;
}

export interface ListTransactionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: TransactionType;
  categoryId?: string;
  from?: string;
  to?: string;
}

export const financeApi = {
  myCharges: () => http.get<Charge[]>('/members/me/charges').then((r) => r.data),
  memberCharges: (memberId: string) => http.get<Charge[]>(`/members/${memberId}/charges`).then((r) => r.data),
  listCharges: (params: ListChargesParams) => http.get<Paginated<Charge>>('/charges', { params }).then((r) => r.data),
  createCharge: (input: { memberId: string; referenceMonth: string; amountCents: number; dueDate: string; notes?: string }) =>
    http.post<Charge>('/charges', input).then((r) => r.data),
  generateMonth: () => http.post<{ created: number }>('/charges/generate-month').then((r) => r.data),
  registerPayment: (id: string, input: { paymentMethod: PaymentMethod; paidAt?: string }) =>
    http.post<Charge>(`/charges/${id}/payment`, input).then((r) => r.data),
  waiveCharge: (id: string, reason?: string) => http.post<Charge>(`/charges/${id}/waive`, { reason }).then((r) => r.data),
  cancelCharge: (id: string, reason?: string) => http.post<Charge>(`/charges/${id}/cancel`, { reason }).then((r) => r.data),

  listFeeRules: () => http.get<MembershipFeeRule[]>('/fee-rules').then((r) => r.data),
  createFeeRule: (input: { name?: string; amountCents: number; dueDay?: number; chapterId?: string }) =>
    http.post<MembershipFeeRule>('/fee-rules', input).then((r) => r.data),
  removeFeeRule: (id: string) => http.delete(`/fee-rules/${id}`).then((r) => r.data),

  listCategories: () => http.get<FinancialCategory[]>('/financial-categories').then((r) => r.data),
  createCategory: (input: { name: string; kind?: TransactionType }) =>
    http.post<FinancialCategory>('/financial-categories', input).then((r) => r.data),
  removeCategory: (id: string) => http.delete(`/financial-categories/${id}`).then((r) => r.data),

  listTransactions: (params: ListTransactionsParams) =>
    http.get<Paginated<FinancialTransaction> & { totals: { incomeCents: number; expenseCents: number } }>('/financial-transactions', { params }).then((r) => r.data),
  createTransaction: (input: { type: TransactionType; amountCents: number; occurredAt: string; categoryId?: string; description?: string }) =>
    http.post<FinancialTransaction>('/financial-transactions', input).then((r) => r.data),
  removeTransaction: (id: string) => http.delete(`/financial-transactions/${id}`).then((r) => r.data),

  summary: (from?: string, to?: string) => http.get<FinanceSummary>('/finance/summary', { params: { from, to } }).then((r) => r.data),
};
