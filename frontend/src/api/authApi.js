import axiosClient from './axiosClient';

/**
 * Auth API Service Module
 * Handles endpoints exposed by AuthController (/api/auth)
 */
export const authApi = {
  /**
   * Endpoint #1: POST /api/auth/register
   * Registers a new user account.
   * @param {Object} data - RegisterRequest { name, email, password }
   * @returns {Promise<Object>} RegisterResponse { id, name, email, role }
   */
  register: (data) => axiosClient.post('/auth/register', data),

  /**
   * Endpoint #2: POST /api/auth/login
   * Authenticates user credentials and returns JWT token.
   * @param {Object} data - LoginRequest { email, password }
   * @returns {Promise<Object>} LoginResponse { token, id, name, email, role }
   */
  login: (data) => axiosClient.post('/auth/login', data),
};

export default authApi;
