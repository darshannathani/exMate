import React, { lazy } from 'react';

const LoginForm = lazy(() => import('../components/auth/LoginForm'));
const DashboardComponent = lazy(() => import('../components/layout/Dashboard'));
const LandingPage = lazy(() => import('../components/LandingPage'));

export const publicRoutes = [
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        path: '/dashboard',
        element: <DashboardComponent />,
    },
];