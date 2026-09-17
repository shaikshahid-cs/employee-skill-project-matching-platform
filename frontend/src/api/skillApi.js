import axiosClient from './axiosClient';

/**
 * Skill Catalog API Service Module
 * Handles endpoints exposed by SkillController (/api/skills)
 */
export const skillApi = {
  /**
   * Endpoint #7: GET /api/skills
   * Searches/fetches skills from global catalog with optional name query parameter.
   * @param {string} [nameQuery] - Optional skill name search query
   * @returns {Promise<Array>} List<SkillResponse> { id, name }
   */
  searchSkills: (nameQuery) => {
    const params = nameQuery ? { name: nameQuery } : {};
    return axiosClient.get('/skills', { params });
  },
};

export default skillApi;
