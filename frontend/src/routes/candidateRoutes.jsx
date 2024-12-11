import { lazy } from 'react';

const AvailableExams = lazy(() => import('../components/candidate/AvailableExams'));
const MyResults = lazy(() => import('../components/candidate/MyResults'));
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
        path: '/candidate/exam-result',
        element: <ExamResultPage />,
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