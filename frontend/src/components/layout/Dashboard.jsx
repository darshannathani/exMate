import React, { useEffect, useState } from 'react';
import { examinerService } from '../../api/services/examinerService';
import { authService } from '../../api/services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardComponent = () => {
    const [examiners, setExaminers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { updateAuthState, userRole } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const token = document.cookie.split('; ')
                    .find(row => row.startsWith('jwt='))
                    ?.split('=')[1];

                if (!token) {
                    updateAuthState(null);
                    navigate('/login');
                    return;
                }

                const role = await authService.getUserRole();
                updateAuthState(role);

                if (role === 'ROLE_EXAMINER') {
                    fetchExaminers();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                updateAuthState(null);
                setError('Authentication failed');
                setLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [navigate, updateAuthState]);

    const fetchExaminers = async () => {
        try {
            const data = await examinerService.getAllExaminers();
            setExaminers(data);
        } catch (error) {
            setError('Failed to fetch examiners');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e_id) => {
        if (window.confirm('Are you sure you want to delete this examiner?')) {
            try {
                await examinerService.deleteExaminer(e_id);
                setExaminers(examiners.filter(examiner => examiner.e_id !== e_id));
            } catch (error) {
                setError('Failed to delete examiner');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {userRole === 'ROLE_CANDIDATE' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Candidate Dashboard</h2>
                    <p className="text-lg">Welcome to your candidate dashboard. Here you can view your exams and results.</p>
                </div>
            )}
            {userRole === 'ROLE_EXAMINER' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Examiners Dashboard</h2>
                    <div className="grid gap-4">
                        {examiners.map(examiner => (
                            <div key={examiner.e_id} className="p-4 border rounded shadow">
                                <h3 className="font-bold">{examiner.name}</h3>
                                <p>{examiner.email}</p>
                                <button
                                    onClick={() => handleDelete(examiner.e_id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardComponent;
