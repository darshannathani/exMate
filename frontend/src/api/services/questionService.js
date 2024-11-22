import api from '../axios.config';

export const questionService = {
    addQuestion: async (questionData) => {
        const response = await api.post('/admin/question', questionData);
        return response.data;
    },

    updateQuestion: async (questionId, questionData) => {
        const response = await api.put(`/admin/question/${questionId}`, questionData);
        return response.data;
    },

    getQuestionById: async (questionId) => {
        const response = await api.get(`/admin/question/${questionId}`);
        return response.data;
    },

    getAllQuestions: async () => {
        const response = await api.get('/admin/question');
        return response.data;
    },

    deleteQuestion: async (questionId) => {
        const response = await api.delete(`/admin/question/${questionId}`);
        return response.data;
    },

    addOption: async (questionId, optionData) => {
        const response = await api.post(`/admin/question/${questionId}/option`, optionData);
        return response.data;
    },

    getQuestionsByCategory: async (category) => {
        const response = await api.get(`/admin/question/category/${category}`);
        return response.data;
    },

    updateOption: async (optionId, optionData) => {
        const response = await api.put(`/admin/question/option/${optionId}`, optionData);
        return response.data;
    },

    getOptionById: async (optionId) => {
        const response = await api.get(`/admin/question/option/${optionId}`);
        return response.data;
    },

    getAllOptions: async () => {
        const response = await api.get('/admin/question/option');
        return response.data;
    },

    deleteOption: async (optionId) => {
        const response = await api.delete(`/admin/question/option/${optionId}`);
        return response.data;
    },

    getOptionsByQuestionId: async (questionId) => {
        const response = await api.get(`/admin/question/option/question/${questionId}`);
        return response.data;
    },

    deleteOptionsByQuestionId: async (questionId) => {
        const response = await api.delete(`/admin/question/option/question/${questionId}`);
        return response.data;
    }
};