import axiosClient from './axiosClient';

/**
 * Employee Profile API Service Module
 * Handles endpoints exposed by EmployeeController (/api/employees)
 */
export const employeeApi = {
  /**
   * Endpoint #3: POST /api/employees/profile
   * Creates initial employee profile.
   * @param {Object} data - EmployeeProfileRequest { department, designation, experience }
   * @returns {Promise<Object>} EmployeeProfileResponse { id, userId, name, email, department, designation, experience }
   */
  createProfile: (data) => axiosClient.post('/employees/profile', data),

  /**
   * Endpoint #4: GET /api/employees/profile
   * Retrieves profile details for the authenticated employee.
   * @returns {Promise<Object>} EmployeeProfileResponse
   */
  getProfile: () => axiosClient.get('/employees/profile'),
};

export default employeeApi;
