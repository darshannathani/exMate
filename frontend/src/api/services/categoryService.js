// import api from '../axios.config';

// export const categoryService = {
//     getCategoryById: async (id) => {
//         const response = await api.get(`/categories/${id}`);
//         return response.data;
//     },

//     getAllCategories: async () => {
//         const response = await api.get('/categories');
//         return response.data;
//     },

//     createCategory: async (categoryData) => {
//         const response = await api.post('/categories', categoryData);
//         return response.data;
//     },

//     updateCategory: async (id, categoryData) => {
//         const response = await api.put(`/categories/${id}`, categoryData);
//         return response.data;
//     },

//     deleteCategory: async (id) => {
//         const response = await api.delete(`/categories/${id}`);
//         return response.data;
//     }
// };