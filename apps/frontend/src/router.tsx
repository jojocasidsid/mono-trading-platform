import { Navigate, createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '@/auth/ProtectedRoute';

import AppLayout from '@/components/layout/AppLayout';

import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

import TradesPage from '@/pages/trades/TradesPage';
import TradeHistoryPage from '@/pages/tradeHistory/TradeHistoryPage';
import PnlPage from '@/pages/pnl/PnlPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/signup',
    element: <SignupPage />,
  },

  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <AppLayout />,

        children: [
          {
            path: '/',
            element: <Navigate to="/trades" replace />,
          },

          {
            path: '/trades',
            element: <TradesPage />,
          },

          {
            path: '/pnl',
            element: <PnlPage />,
          },

          {
            path: '/trade-history',
            element: <TradeHistoryPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
