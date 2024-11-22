import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateAuthState = (role) => {
        setIsAuthenticated(!!role);
        setUserRole(role);
    };

    const initializeAuth = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('jwt='))
                ?.split('=')[1];
            if (!token) throw new Error('No token found');

            const role = await authService.getUserRole();
            updateAuthState(role);
        } catch (error) {
            console.error('Failed to initialize authentication:', error);
            updateAuthState(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        document.cookie = 'jwt=; Max-Age=0; path=/';
        updateAuthState(null);
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const value = {
        isAuthenticated,
        userRole,
        updateAuthState,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
