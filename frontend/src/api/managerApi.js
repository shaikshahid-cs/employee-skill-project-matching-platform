import axiosClient from './axiosClient';

/**
 * Manager Profile API Service Module
 * Handles endpoints exposed by ManagerController (/api/managers)
 */
export const managerApi = {
  /**
   * Endpoint #5: POST /api/managers/profile
   * Creates initial manager profile.
   * @param {Object} data - ManagerProfileRequest { department, designation }
   * @returns {Promise<Object>} ManagerProfileResponse { id, userId, name, email, department, designation }
   */
  createProfile: (data) => axiosClient.post('/managers/profile', data),

  /**
   * Endpoint #6: GET /api/managers/profile
   * Fetches manager profile details for the authenticated user.
   * @returns {Promise<Object>} ManagerProfileResponse
   */
  getProfile: () => axiosClient.get('/managers/profile'),
};

export default managerApi;
