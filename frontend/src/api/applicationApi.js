import axiosClient from './axiosClient';

/**
 * Project Applications API Service Module
 * Handles endpoints exposed by ApplicationController (/api/applications)
 */
export const applicationApi = {
  /**
   * Endpoint #41: POST /api/applications
   * Submits a new project application for the authenticated employee.
   * @param {Object} data - ApplicationRequest { projectId }
   * @returns {Promise<Object>} ApplicationResponse { id, projectId, employeeId, status }
   */
  applyToProject: (data) => axiosClient.post('/applications', data),

  /**
   * Endpoint #42: GET /api/applications/my
   * Fetches applications submitted by the authenticated employee.
   * @returns {Promise<Array>} List<ApplicationResponse>
   */
  getMyApplications: () => axiosClient.get('/applications/my'),

  /**
   * Endpoint #43: GET /api/applications/project/{projectId}
   * Fetches all submitted applications for a specific project.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Array>} List<ApplicationResponse>
   */
  getProjectApplications: (projectId) => axiosClient.get(`/applications/project/${projectId}`),

  /**
   * Endpoint #44: PUT /api/applications/{applicationId}/review
   * Manager review operation to ACCEPT or REJECT a project application.
   * @param {number|string} applicationId - Application ID
   * @param {Object} data - ApplicationReviewRequest { status: 'ACCEPTED' | 'REJECTED' }
   * @returns {Promise<Object>} ApplicationReviewResponse { id, projectId, employeeId, status }
   */
  reviewApplication: (applicationId, data) => axiosClient.put(`/applications/${applicationId}/review`, data),

  /**
   * Endpoint #45: POST /api/applications/select-candidate
   * Manager direct candidate selection/shortlisting from candidate match matrix.
   */
  selectCandidate: (projectId, employeeId, status = 'SHORTLISTED') =>
    axiosClient.post(`/applications/select-candidate?projectId=${projectId}&employeeId=${employeeId}&status=${status}`),
};

export default applicationApi;
