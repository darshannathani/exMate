import React, { lazy } from 'react';

const AvailableExams = lazy(() => import('../components/candidate/AvailableExams'));
const MyResults = lazy(() => import('../components/candidate/MyResults'));
const Profile = lazy(() => import('../components/candidate/Profile'));
const StudyMaterials = lazy(() => import('../components/candidate/StudyMaterials'));

export const candidateRoutes = [
    {
        path: '/candidate/available-exams',
        element: <AvailableExams />,
    },
    {
        path: '/candidate/my-results',
        element: <MyResults />,
    },
    {
        path: '/candidate/profile',
        element: <Profile />,
    },
    {
        path: '/candidate/study-materials',
        element: <StudyMaterials />,
    },
];