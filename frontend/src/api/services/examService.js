import api from '../axios.config';

export const examService = {
    scheduleExam: async (examId) => {
        const response = await api.post('/admin/exam', examId);
        return response.data;
    },

    updateExam: async (examId, examData) => {
        const response = await api.put(`/admin/exam/update/${examId}`, examData);
        return response.data;
    },

    getAllExams: async () => {
        const response = await api.get('/admin/exam');
        return response.data;
    },

    deleteExam: async (examId) => {
        const response = await api.delete(`/admin/exam/delete/${examId}`);
        return response.data;
    },

    getExamById: async (examId) => {
        const response = await api.get(`/admin/exam/${examId}`);
        return response.data;
    },

    createExam: async (examData) => {
        const response = await api.post('/admin/exam/create-exam', examData);
        return response.data;
    },

    getQuestionsByExam: async (examId) => {
        const response = await api.get(`/admin/exam/${examId}/questions`);
        return response.data;
    },

    updateExamDifficulty: async (examId, difficulty) => {
        const response = await api.put(`/admin/exam/${examId}/update-difficulty`, difficulty);
        return response.data;
    }
};