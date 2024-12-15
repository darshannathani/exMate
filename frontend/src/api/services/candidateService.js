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
        const response = await api.get(`/candidate/exam`);
        return response.data;
    },

    startExam: async (examId) => {
        const response = await api.post(`/candidate/exam/${examId}/start`);
        return response.data;
    },

    submitLogicalSection: async (data) => {
        const response = await api.post(`/candidate/exam/${data.examId}/submit/logical`, {
            answers: data.responses
        });
        return response.data;
    },

    submitTechnicalSection: async (data) => {
        const response = await api.post(`/candidate/exam/${data.examId}/submit/technical`, {
            answers: data.responses
        });
        return response.data;
    },

    submitProgrammingSection: async (data) => {
        const response = await api.post(`/candidate/exam/${data.examId}/submit/programming`, {
            answers: data.responses
        });
        return response.data;
    },
};