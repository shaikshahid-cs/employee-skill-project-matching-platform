import axiosClient from './axiosClient';

/**
 * Employee Skill API Service Module
 * Handles endpoints exposed by EmployeeSkillController (/api/employee/skills)
 */
export const employeeSkillApi = {
  addSkill: (data) => axiosClient.post('/employee/skills', data),

  getSkills: () => axiosClient.get('/employee/skills'),

  updateSkill: (id, data) => axiosClient.put(`/employee/skills/${id}`, data),

  deleteSkill: (id) => axiosClient.delete(`/employee/skills/${id}`),
};

export default employeeSkillApi;
