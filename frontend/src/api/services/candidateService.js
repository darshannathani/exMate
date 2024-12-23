import api from '../axios.config';

export const candidateService = {
    getCandidateById: async (id) => {
        const response = await api.get(`/candidate/${id}`);
        return response.data;
    },

    getAllCandidates: async () => {
        const response = await api.get('/candidate');
        return response.data;
    },

    updateCandidate: async (id, candidateData) => {
        const response = await api.put(`/candidate/${id}`, candidateData);
        return response.data;
    },

    deleteCandidate: async (id) => {
        const response = await api.delete(`/candidate/${id}`);
        return response.data;
    },

    addCandidate: async (candidateData) => {
        const response = await api.post('/candidate', candidateData);
        return response.data;
    },

    getAvailableExams: async () => {
        const response = await api.get('/candidate/exam');
        return response.data;
    },

    startExam: async (examId) => {
        const response = await api.post(`/candidate/exam/${examId}/start`);
        return response.data;
    },

    submitResponses: async (examId, responses) => {
        const response = await api.post(`/candidate/exam/${examId}/submit`, responses);
        return response.data;
    },

    endExam: async (examId) => {
        const response = await api.post(`/candidate/exam/${examId}/end`);
        return response.data;
    },

    getExamById: async (examId) => {
        const response = await api.get(`/candidate/exam/${examId}`);
        return response.data;
    },

    getExamStatus: async (examId) => {
        const response = await api.get(`/candidate/exam/${examId}/status`);
        return response.data;
    },

    getAllResults: async (candidateId) => {
        const response = await api.get(`/candidate/results/${candidateId}`);
        return response.data;
    },

    getDetailedExamResult: async (candidateId, examId) => {
        const response = await api.get(`/candidate/results/${candidateId}/exam/${examId}`);
        return response.data;
    },

    getSectionWiseAnalysis: async (candidateId, examId) => {
        const response = await api.get(`/candidate/results/${candidateId}/exam/${examId}/sections`);
        return response.data;
    },

    getCompletedExams: async (candidateId) => {
        const response = await api.get(`/candidate/results/${candidateId}/completed`);
        return response.data;
    },

    getPendingExams: async (candidateId) => {
        const response = await api.get(`/candidate/results/${candidateId}/pending`);
        return response.data;
    }
};