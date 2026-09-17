import axiosClient from './axiosClient';

/**
 * Project Skill Requirements API Service Module
 * Handles endpoints exposed by ProjectSkillController (/api/managers/project-skills)
 */
export const projectSkillApi = {
  /**
   * Endpoint #14: POST /api/managers/project-skills
   * Adds a required skill constraint to a project.
   * @param {Object} data - ProjectSkillRequest { projectId, skillName, requiredProficiency, importance }
   * @returns {Promise<Object>} ProjectSkillResponse { id, projectId, skillId, skillName, requiredProficiency, importance }
   */
  addProjectSkill: (data) => axiosClient.post('/managers/project-skills', data),

  /**
   * Endpoint #15: GET /api/managers/project-skills/project/{projectId}
   * Retrieves required skills for a given project.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Array>} List<ProjectSkillResponse>
   */
  getSkillsForProject: (projectId) => axiosClient.get(`/managers/project-skills/project/${projectId}`),

  /**
   * Endpoint #16: PUT /api/managers/project-skills/{id}
   * Updates required proficiency or importance weight for a project skill entry.
   * @param {number|string} id - ProjectSkill record ID
   * @param {Object} data - ProjectSkillRequest
   * @returns {Promise<Object>} ProjectSkillResponse
   */
  updateProjectSkill: (id, data) => axiosClient.put(`/managers/project-skills/${id}`, data),
};

export default projectSkillApi;
