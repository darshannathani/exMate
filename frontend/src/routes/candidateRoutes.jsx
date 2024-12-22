import { lazy } from 'react';

const AvailableExams = lazy(() => import('../components/candidate/AvailableExams'));
const Profile = lazy(() => import('../components/candidate/Profile'));
const StudyMaterials = lazy(() => import('../components/candidate/StudyMaterials'));
const ExamPage = lazy(() => import('../components/candidate/ExamPage'));
const ExamResultPage = lazy(() => import('../components/candidate/ExamResultPage'));

export const candidateRoutes = [
    {
        path: '/candidate/available-exams',
        element: <AvailableExams />,
    },
    {
        path: '/candidate/exam/:examId',
        element: <ExamPage />,
    },
    {
        path: '/candidate/my-results',
        element: <ExamResultPage />,
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