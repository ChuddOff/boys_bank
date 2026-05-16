export type Role = 'USER' | 'ADMIN' | 'CLIENT';
export type AccountType = 'CURRENT' | 'SAVINGS' | 'DONATION';
export type TransactionType = 'TRANSFER' | 'DONATION' | 'DEPOSIT_OPEN' | 'ADJUSTMENT';

export interface AuthResponse { token: string; tokenType: string; expiresInSeconds: number }
export interface User { id: number; firstName: string; lastName: string; email: string; roles: Role[]; createdAt: string }
export interface Account { id: number; iban: string; type: AccountType; balance: number; currency: string; active: boolean }
export interface Transaction { id: number; fromAccountId: number | null; toAccountId: number | null; amount: number; type: TransactionType; operationId: string; createdAt: string; description?: string | null }
export interface Card { id: number; accountId: number; maskedNumber: string; expiresAt: string; status: 'ACTIVE' | 'BLOCKED' }
export interface Loan { id: number; amount: number; termMonths: number; annualRate: number; purpose?: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; createdAt: string }
export interface Deposit { id: number; accountId: number; principal: number; annualRate: number; termMonths: number; openedAt: string; maturityDate: string; projectedPayout: number; active: boolean }
export interface FraudCheck { suspicious: boolean; riskScore: number; reason: string; source: string }
export interface FraudTransaction { id: number; transaction: Transaction; suspicious: boolean; riskScore: number; reason: string; source: string; status: 'NEW' | 'SAFE' | 'SUSPICIOUS'; reviewerNote?: string | null }
export interface MonthlyAnalytics { month: string; outgoingOperations: number; outgoingTotal: number; incomingOperations: number; incomingTotal: number }

export interface CreditEstimate { requestedAmount: number; termMonths: number; annualRate: number; monthlyPayment: number; totalPayment: number; overpayment: number }
export interface DepositEstimate { amount: number; termMonths: number; annualRate: number; maturityDate: string; projectedPayout: number; income: number }
