import axiosClient from './axiosClient';

/**
 * Employee Profile API Service Module
 * Handles endpoints exposed by EmployeeController (/api/employee/profile)
 */
export const employeeApi = {
  getProfile: () => axiosClient.get('/employee/profile'),

  createProfile: (data) => axiosClient.post('/employee/profile', data),

  updateProfile: (data) => axiosClient.put('/employee/profile', data),
};

export default employeeApi;
