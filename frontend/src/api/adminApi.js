import axiosClient from './axiosClient';

/**
 * Admin Management API Service Module
 * Handles endpoints exposed by AdminController (/api/admin)
 */
export const adminApi = {
  /**
   * Endpoint #45: GET /api/admin/users
   * Retrieves user directory list across all roles.
   * @returns {Promise<Array>} List<UserResponse> { id, name, email, role }
   */
  getAllUsers: () => axiosClient.get('/admin/users'),

  /**
   * Endpoint #46: GET /api/admin/users/{id}
   * Retrieves single user details by ID.
   * @param {number|string} id - User ID
   * @returns {Promise<Object>} UserResponse
   */
  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),

  /**
   * Endpoint #47: GET /api/admin/stats
   * Retrieves system administrative metrics and platform entity counts.
   * @returns {Promise<Object>} AdminStatsResponse { totalUsers, totalEmployees, totalManagers, totalProjects, openProjects, totalApplications, totalSkills, totalMatchResults }
   */
  getAdminStats: () => axiosClient.get('/admin/stats'),
};

export default adminApi;
