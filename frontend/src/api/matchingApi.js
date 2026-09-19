import axiosClient from './axiosClient';

/**
 * Candidate Matching Engine API Service Module
 * Handles endpoints exposed by MatchResultController (/api/match-results)
 */
export const matchingApi = {
  /**
   * Endpoint #33: POST /api/match-results/calculate
   * Triggers match calculation for a single employee against a specific project.
   * @param {Object} data - MatchCalculationRequest { employeeId, projectId }
   * @returns {Promise<Object>} MatchResultResponse
   */
  calculateSingleMatch: (data) => axiosClient.post('/match-results/calculate', data),

  /**
   * Endpoint #34: POST /api/match-results/project/{projectId}/calculate-all
   * Runs the match engine for ALL candidate employees against a given project.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Array>} List<MatchResultResponse> (sorted by matchScore desc)
   */
  calculateAllProjectMatches: (projectId) => axiosClient.post(`/match-results/project/${projectId}/calculate-all`),

  /**
   * Endpoint #35: GET /api/match-results/my-matches
   * Fetches calculated match results for the authenticated employee.
   * @returns {Promise<Array>} List<MatchResultResponse>
   */
  getMyMatches: () => axiosClient.get('/match-results/my-matches'),

  /**
   * Endpoint #36: GET /api/match-results/project/{projectId}
   * Retrieves previously calculated match results stored for a project.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Array>} List<MatchResultResponse>
   */
  getProjectMatches: (projectId) => axiosClient.get(`/match-results/project/${projectId}`),

  /**
   * Endpoint #37: GET /api/match-results/project/{projectId}/recommended
   * Note: Backend implementation delegates directly to matchResultService.calculateAllMatchesForProject(projectId),
   * which may trigger database calculation work rather than serving a simple read-only query.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Array>} List<MatchResultResponse>
   */
  getRecommendedCandidates: (projectId) => axiosClient.get(`/match-results/project/${projectId}/recommended`),

  /**
   * Endpoint #38: GET /api/match-results/{id}
   * Retrieves a single match result record by ID.
   * @param {number|string} id - MatchResult record ID
   * @returns {Promise<Object>} MatchResultResponse
   */
  getMatchById: (id) => axiosClient.get(`/match-results/${id}`),

  /**
   * Endpoint #39: GET /api/match-results/{id}/explanation
   * Retrieves granular match score breakdown, points distribution, matched skills, and missing skills.
   * @param {number|string} id - MatchResult record ID
   * @returns {Promise<Object>} MatchExplanationResponse
   */
  getMatchExplanation: (id) => axiosClient.get(`/match-results/${id}/explanation`),

  /**
   * Retrieves candidate matches calculated specifically for a manager's project
   */
  getCandidatesForProject: (projectId) => axiosClient.get(`/manager/projects/${projectId}/candidates`),

  /**
   * Retrieves detailed candidate explainability for a project
   */
  getCandidateExplanation: (projectId, employeeId) =>
    axiosClient.get(`/manager/projects/${projectId}/candidates/${employeeId}/explanation`),

  /**
   * Endpoint #40: DELETE /api/match-results/{id}
   * Deletes a match result entry.
   * @param {number|string} id - MatchResult record ID
   * @returns {Promise<void>} 204 No Content
   */
  deleteMatch: (id) => axiosClient.delete(`/match-results/${id}`),
};

export default matchingApi;
