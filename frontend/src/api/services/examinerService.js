import api from '../axios.config';

export const examinerService = {
    getExaminerById: async (id) => {
        const response = await api.get(`/admin/${id}`);
        return response.data;
    },

    getAllExaminers: async () => {
        const response = await api.get('/admin');
        return response.data;
    },

    updateExaminer: async (id, examinerData) => {
        const response = await api.put(`/admin/${id}`, examinerData);
        return response.data;
    },

    deleteExaminer: async (id) => {
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
};