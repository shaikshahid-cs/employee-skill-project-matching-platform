import axiosClient from './axiosClient';

/**
 * Auth API Service Module
 * Handles endpoints exposed by AuthController (/api/auth)
 */
export const authApi = {
  /**
   * Authenticates user credentials and returns JWT token.
   * @param {Object} data - LoginRequest { email, password }
   * @returns {Promise<Object>} LoginResponse { token, id, name, email, role, mustChangePassword }
   */
  login: (data) => axiosClient.post('/auth/login', data),

  /**
   * Changes authenticated user password.
   * @param {Object} data - { currentPassword, newPassword } or { oldPassword, newPassword }
   * @returns {Promise<Object>} Map { message }
   */
  changePassword: (data) =>
    axiosClient.post('/auth/change-password', {
      currentPassword: data.currentPassword || data.oldPassword,
      newPassword: data.newPassword,
    }),

  /**
   * Retrieves current authenticated user profile.
   * @returns {Promise<Object>}
   */
  getMe: () => axiosClient.get('/auth/me'),
};

export default authApi;
