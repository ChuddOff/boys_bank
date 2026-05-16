import { api } from './client';
import { Account, Card, Deposit, FraudCheck, FraudTransaction, Loan, MonthlyAnalytics, Transaction, User } from '../types/bank';
export const bankApi = {
  accounts: () => api.get<Account[]>('/api/accounts').then(r => r.data),
  account: (id: string | number) => api.get<Account>(`/api/accounts/${id}`).then(r => r.data),
  createAccount: (data: { type: string; currency: string }) => api.post<Account>('/api/accounts', data).then(r => r.data),
  topUp: (id: number, amount: number) => api.post<Account>(`/api/accounts/${id}/top-up`, { amount }).then(r => r.data),
  withdraw: (id: number, amount: number) => api.post<Account>(`/api/accounts/${id}/withdraw`, { amount }).then(r => r.data),
  transactions: () => api.get<Transaction[]>('/api/transactions').then(r => r.data),
  accountTransactions: (id: string | number) => api.get<Transaction[]>(`/api/transactions/accounts/${id}`).then(r => r.data),
  transfer: (data: { fromAccountId: number; toIban: string; amount: number; description?: string; operationId: string }) => api.post<Transaction>('/api/transactions/transfer', data).then(r => r.data),
  cards: () => api.get<Card[]>('/api/cards').then(r => r.data),
  createCard: (accountId: number) => api.post<Card>('/api/cards', { accountId }).then(r => r.data),
  setCard: (id: number, action: 'block'|'unblock') => api.patch<Card>(`/api/cards/${id}/${action}`).then(r => r.data),
  profile: () => api.get<User>('/api/profile').then(r => r.data),
  updateProfile: (data: Pick<User, 'firstName'|'lastName'|'email'>) => api.patch<User>('/api/profile', data).then(r => r.data),
  loans: () => api.get<Loan[]>('/api/loans').then(r => r.data),
  applyLoan: (data: { amount: number; termMonths: number; annualRate?: number; purpose?: string }) => api.post<Loan>('/api/loans/applications', data).then(r => r.data),
  deposits: () => api.get<Deposit[]>('/api/deposits').then(r => r.data),
  applyDeposit: (data: { sourceAccountId: number; amount: number; annualRate: number; termMonths: number }) => api.post<Deposit>('/api/deposits/applications', data).then(r => r.data),
  fraudCheck: (data: { message: string; amount: number; currency: string }) => api.post<FraudCheck>('/api/fraud/analyze', data).then(r => r.data),
  fraudTransactions: () => api.get<FraudTransaction[]>('/api/fraud/transactions').then(r => r.data),
  reviewFraud: (id: number, status: 'SAFE'|'SUSPICIOUS', note?: string) => api.post<FraudTransaction>(`/api/fraud/transactions/${id}/review`, { status, note }).then(r => r.data),
  adminUsers: () => api.get<User[]>('/api/admin/users').then(r => r.data),
  updateRole: (id: number, role: string) => api.patch<User>(`/api/admin/users/${id}/role`, { role }).then(r => r.data),
  analytics: (year: number, month: number) => api.get<MonthlyAnalytics>(`/api/analytics/monthly?year=${year}&month=${month}`).then(r => r.data)
};
