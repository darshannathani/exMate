import api from '../axios.config';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (adminData) => {
        const response = await api.post('/auth/register/admin', adminData);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getUserRole: async () => {
        const response = await api.post('/auth/me');
        return response.data;
    }
};