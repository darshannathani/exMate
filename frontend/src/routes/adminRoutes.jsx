import { lazy } from 'react';

const ManageAdmins = lazy(() => import('../components/admin/ManageAdmins'));
const ExamManagement = lazy(() => import('../components/admin/ExamManagement'));
const SystemSettings = lazy(() => import('../components/admin/SystemSettings'));
const ResultsOverview = lazy(() => import('../components/admin/ResultsOverview'));
const CandidateManagement = lazy(() => import('../components/admin/CandidateManagement'));
const QuestionManagement = lazy(() => import('../components/admin/QuestionManagement'));

export const adminRoutes = [
    {
        path: '/admin/manage-admins',
        element: <ManageAdmins />,
    },
    {
        path: '/admin/exam-management',
        element: <ExamManagement />,
    },
    {
        path: '/admin/system-settings',
        element: <SystemSettings />,
    },
    {
        path: '/admin/results-overview',
        element: <ResultsOverview />,
    },
    {
        path: '/admin/candidate-management',
        element: <CandidateManagement />,
    },
    {
        path: '/admin/exam-management',
        element: <ExamManagement />,
    },
    {
        path: '/admin/system-settings',
        element: <SystemSettings />,
    },
    {
        path: '/admin/results-overview',
        element: <ResultsOverview />,
    },
    {
        path: '/admin/question-management',
        element: <QuestionManagement />
    }
];