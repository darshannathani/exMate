import api from '../axios.config';

export const adminService = {
    getAdminById: async (id) => {
        const response = await api.get(`/admin/${id}`);
        return response.data;
    },

    getAllAdmins: async () => {
        const response = await api.get('/admin');
        return response.data;
    },

    updateAdmin: async (id, adminData) => {
        const response = await api.put(`/admin/${id}`, adminData);
        return response.data;
    },

    deleteAdmin: async (id) => {
        const response = await api.delete(`/admin/${id}`);
        return response.data;
    },

    uploadCandidates: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/add-candidates', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    registerAdmin: async (adminData) => {
        const response = await api.post('/admin/register/admin', adminData);
        return response.data;
    }
};