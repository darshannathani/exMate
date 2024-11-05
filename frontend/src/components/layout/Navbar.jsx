import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import image from '/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, userRole, updateAuthState } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await authService.logout();
            updateAuthState(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getNavLinks = () => {
        const commonLinks = [{ path: '/', label: 'Home' }];
        const examinerLinks = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/examiners', label: 'Examiners' },
            { path: '/upload', label: 'Upload Candidates' },
        ];
        const candidateLinks = [{ path: '/dashboard', label: 'Dashboard' }];

        if (userRole === 'ROLE_EXAMINER') return [...commonLinks, ...examinerLinks];
        if (userRole === 'ROLE_CANDIDATE') return [...commonLinks, ...candidateLinks];

        return commonLinks;
    };

    return (
        <nav className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <img src={image} alt="ExMate logo" className="h-8 w-8" />
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-white text-xl font-bold">ExMate</h1>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`${
                                        location.pathname === link.path
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button
                                onClick={isAuthenticated ? handleLogout : () => navigate('/login')}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {isAuthenticated ? 'Logout' : 'Login'}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
