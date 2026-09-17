import axiosClient from './axiosClient';

/**
 * Employee Skill API Service Module
 * Handles endpoints exposed by EmployeeSkillController (/api/employees/skills)
 */
export const employeeSkillApi = {
  /**
   * Endpoint #8: POST /api/employees/skills
   * Adds a skill to the authenticated employee's profile.
   * @param {Object} data - EmployeeSkillRequest { skillName, proficiency, yearsExperience }
   * @returns {Promise<Object>} EmployeeSkillResponse { id, skillId, skillName, proficiency, yearsExperience }
   */
  addSkill: (data) => axiosClient.post('/employees/skills', data),

  /**
   * Endpoint #9: GET /api/employees/skills
   * Fetches all recorded skills for the authenticated employee.
   * @returns {Promise<Array>} List<EmployeeSkillResponse>
   */
  getSkills: () => axiosClient.get('/employees/skills'),
};

export default employeeSkillApi;
