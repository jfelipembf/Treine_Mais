import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// Guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

// Layouts
import BasicLayout from '../components/BasicLayout/BasicLayout';

// Lazy load pages
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Training = lazy(() => import('../pages/Training/Training'));
const Progress = lazy(() => import('../pages/Progress/Progress'));
const Profile = lazy(() => import('../pages/Profile/Profile'));

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {
          path: 'forgot-password',
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
        {
          path: 'dashboard',
          element: (
            <AuthGuard>
              <BasicLayout>
                <Dashboard />
              </BasicLayout>
            </AuthGuard>
          ),
        },
        {
          path: 'training',
          element: (
            <AuthGuard>
              <BasicLayout>
                <Training />
              </BasicLayout>
            </AuthGuard>
          ),
        },
        {
          path: 'progress',
          element: (
            <AuthGuard>
              <BasicLayout>
                <Progress />
              </BasicLayout>
            </AuthGuard>
          ),
        },
        {
          path: 'profile',
          element: (
            <AuthGuard>
              <BasicLayout>
                <Profile />
              </BasicLayout>
            </AuthGuard>
          ),
        },
        {
          path: '/',
          element: <Navigate to="/login" replace />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);
}
