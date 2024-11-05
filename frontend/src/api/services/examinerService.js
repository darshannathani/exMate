import api from '../axios.config';

export const examinerService = {
    getExaminerById: async (id) => {
        const response = await api.get(`/examiner/${id}`);
        return response.data;
    },

    getAllExaminers: async () => {
        const response = await api.get('/examiner');
        return response.data;
    },

    updateExaminer: async (id, examinerData) => {
        const response = await api.put(`/examiner/${id}`, examinerData);
        return response.data;
    },

    deleteExaminer: async (id) => {
        const response = await api.delete(`/examiner/${id}`);
        return response.data;
    },

    uploadCandidates: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/examiner/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
};