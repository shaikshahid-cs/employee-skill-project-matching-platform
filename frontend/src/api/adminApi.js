import axiosClient from './axiosClient';

/**
 * Admin Management API Service Module
 * Handles endpoints exposed by AdminController (/api/admin)
 */
export const adminApi = {
  getAllUsers: () => axiosClient.get('/admin/users'),

  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),

  createEmployee: (data) => axiosClient.post('/admin/employees', data),

  createManager: (data) => axiosClient.post('/admin/managers', data),

  toggleUserStatus: (id, isActive) => axiosClient.put(`/admin/users/${id}/status`, null, { params: { active: isActive } }),

  resetPassword: (id, newPassword) => axiosClient.post(`/admin/users/${id}/reset-password`, { newPassword }),

  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

  getOverview: () => axiosClient.get('/admin/overview'),

  getAdminStats: () => axiosClient.get('/admin/stats'),
};

export default adminApi;
