import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Container,
    Typography,
    CircularProgress,
    Grid,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People as PeopleIcon,
    Description as DescriptionIcon,
    Settings as SettingsIcon,
    Assessment as AssessmentIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    MenuBook as MenuBookIcon,
} from '@mui/icons-material';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { updateAuthState, userRole } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('jwt='))
                    ?.split('=')[1];
                if (!token) {
                    updateAuthState(null);
                    navigate('/login');
                    return;
                }

                const role = await authService.getUserRole();
                updateAuthState(role);
                setLoading(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                updateAuthState(null);
                setError('Authentication failed');
                setLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [navigate, updateAuthState]);

    const navigationCards = {
        ROLE_ADMIN: [
            {
                title: 'Manage Admins',
                description: 'Add, remove, or modify admin accounts',
                icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                path: '/admin/manage-admins'
            },
            {
                title: 'Exam Management',
                description: 'Create and manage examination papers',
                icon: <DescriptionIcon sx={{ fontSize: 40, color: 'success.main' }} />,
                path: '/admin/exam-management'
            },
            {
                title: 'System Settings',
                description: 'Configure system parameters and settings',
                icon: <SettingsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
                path: '/admin/system-settings'
            },
            {
                title: 'Results Overview',
                description: 'View and analyze examination results',
                icon: <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
                path: '/admin/results-overview'
            },
            {
                title: 'Candidate Management',
                description: 'Manage candidate accounts and data',
                icon: <PeopleIcon sx={{ fontSize: 40, color: '#f9a825' }} />,
                path: '/admin/candidate-upload'
            }
        ],
        ROLE_CANDIDATE: [
            {
                title: 'Available Exams',
                description: 'View and take available examinations',
                icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                path: '/candidate/available-exams'
            },
            {
                title: 'My Results',
                description: 'View your examination results and progress',
                icon: <AssessmentIcon sx={{ fontSize: 40, color: 'success.main' }} />,
                path: '/candidate/my-results'
            },
            {
                title: 'Profile',
                description: 'Update your personal information',
                icon: <PersonIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
                path: '/candidate/profile'
            },
            {
                title: 'Study Materials',
                description: 'Access study resources and guides',
                icon: <MenuBookIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
                path: '/candidate/study-materials'
            }
        ]
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {userRole === 'ROLE_ADMIN' ? 'Admin Dashboard' : 'Candidate Dashboard'}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Welcome to your dashboard. Select a card to navigate to different sections.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {navigationCards[userRole]?.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                backgroundColor: isDarkMode ? 'grey.800' : 'background.paper',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                }
                            }}
                            onClick={() => navigate(card.path)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                    {card.icon}
                                </Box>
                                <Typography variant="h6" component="h2" align="center" gutterBottom>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;