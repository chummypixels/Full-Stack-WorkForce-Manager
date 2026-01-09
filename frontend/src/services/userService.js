import apiClient from './api';

export const userService = {
  createUser: (userData) => apiClient.post('/api/users', userData),

  getAllUsers: () => apiClient.get('/api/users'),

  getUserById: (id) => apiClient.get(`/api/users/${id}`),
};
