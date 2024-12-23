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
    },

    computeExamResult: async (candidateId, examId) => {
        const response = await api.post(`/admin/results/compute/${candidateId}/${examId}`);
        return response.data;
    },

    getResultsByExam: async (examId) => {
        const response = await api.get(`/admin/results/exam/${examId}`);
        return response.data;
    },

    getResultByExamAndCandidate: async (examId, candidateId) => {
        const response = await api.get(`/admin/results/exam/${examId}/candidate/${candidateId}`);
        return response.data;
    },

    computeAllResult: async (examId) => {
        const response = await api.post(`/admin/results/compute/exam/${examId}`);
        return response.data;
    }
};