import { Navigate, createBrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store';
import { AppLayout } from '../shared/components/Layout';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { AccountsPage } from '../pages/AccountsPage';
import { AdminPage } from '../pages/AdminPage';
import { CardsPage } from '../pages/CardsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DepositApplicationPage } from '../pages/DepositApplicationPage';
import { DepositsPage } from '../pages/DepositsPage';
import { FraudPage } from '../pages/FraudPage';
import { DonationsPage } from '../pages/DonationsPage';
import { FraudTransactionsPage } from '../pages/FraudTransactionsPage';
import { LoanApplicationPage } from '../pages/LoanApplicationPage';
import { LoansPage } from '../pages/LoansPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { TransferPage } from '../pages/TransferPage';
import type { ReactElement } from 'react';
function Protected({ children, admin=false }: { children: ReactElement; admin?: boolean }) { const { token, user } = useAuthStore(); if (!token) return <Navigate to="/login" replace/>; if (admin && user && !user.roles.includes('ADMIN')) return <Navigate to="/dashboard" replace/>; return children; }
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace/> },
  { path: '/login', element: <LoginPage/> },
  { path: '/register', element: <RegisterPage/> },
  { element: <Protected><AppLayout/></Protected>, children: [
    { path: '/dashboard', element: <DashboardPage/> }, { path: '/accounts', element: <AccountsPage/> }, { path: '/accounts/:id', element: <AccountDetailsPage/> },
    { path: '/transactions', element: <TransactionsPage/> }, { path: '/transfers/new', element: <TransferPage/> }, { path: '/donations', element: <DonationsPage/> }, { path: '/cards', element: <CardsPage/> },
    { path: '/profile', element: <ProfilePage/> }, { path: '/loans', element: <LoansPage/> }, { path: '/loans/new', element: <LoanApplicationPage/> },
    { path: '/deposits', element: <DepositsPage/> }, { path: '/deposits/new', element: <DepositApplicationPage/> }, { path: '/fraud', element: <FraudPage/> },
    { path: '/fraud/transactions', element: <FraudTransactionsPage/> }, { path: '/admin', element: <Protected admin><AdminPage/></Protected> }
  ]},
  { path: '/not-found', element: <NotFoundPage/> }, { path: '*', element: <NotFoundPage/> }
]);
