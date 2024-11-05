import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useTheme } from '../../contexts/ThemeContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { isDarkMode } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setError('Login failed, Invalid email or password');
        }
    };

    return (
        <div className={`max-w-md mx-auto mt-8 p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded shadow`}>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full ${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} text-white p-2 rounded hover:${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'}`}
                >
                    Login
                </button>
            </form>
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};

export default LoginForm;
