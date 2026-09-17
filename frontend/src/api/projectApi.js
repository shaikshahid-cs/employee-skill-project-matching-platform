import axiosClient from './axiosClient';

/**
 * Project Management & Discovery API Service Module
 * Handles endpoints exposed by ProjectController (/api/managers/projects) & ProjectDiscoveryController (/api/projects)
 */
export const projectApi = {
  /**
   * Endpoint #10: POST /api/managers/projects
   * Creates a new project posting.
   * @param {Object} data - ProjectRequest { title, description, department, location, experienceRequired }
   * @returns {Promise<Object>} ProjectResponse { id, managerId, title, description, department, location, experienceRequired, status }
   */
  createProject: (data) => axiosClient.post('/managers/projects', data),

  /**
   * Endpoint #11: GET /api/managers/projects
   * Retrieves projects created by the authenticated manager.
   * @returns {Promise<Array>} List<ProjectResponse>
   */
  getManagerProjects: () => axiosClient.get('/managers/projects'),

  /**
   * Endpoint #12: GET /api/projects/open
   * Browses open projects available for employee application.
   * @returns {Promise<Array>} List<ProjectResponse>
   */
  getOpenProjects: () => axiosClient.get('/projects/open'),

  /**
   * Endpoint #13: GET /api/projects/recommendations
   * Fetches personalized project recommendations for the authenticated employee.
   * @returns {Promise<Array>} List<MatchResultResponse>
   */
  getRecommendedProjects: () => axiosClient.get('/projects/recommendations'),
};

export default projectApi;
