import axiosClient from './axiosClient';

/**
 * Job Description API Service Module
 * Handles endpoints exposed by JobDescriptionController (/api/managers/projects/{projectId}/job-description)
 */
export const jobDescriptionApi = {
  /**
   * Endpoint #20: POST /api/managers/projects/{projectId}/job-description
   * Uploads a Job Description document for a project using multipart form data.
   * @param {number|string} projectId - Project ID
   * @param {File} file - JD document file
   * @returns {Promise<Object>} JobDescriptionResponse { id, projectId, fileName, processingStatus, uploadedAt }
   */
  uploadJobDescription: (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/managers/projects/${projectId}/job-description`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Endpoint #21: GET /api/managers/projects/{projectId}/job-description
   * Fetches attached Job Description document metadata for a project.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Object>} JobDescriptionResponse
   */
  getJobDescription: (projectId) => axiosClient.get(`/managers/projects/${projectId}/job-description`),

  /**
   * Endpoint #22: POST /api/managers/projects/{projectId}/job-description/process
   * Triggers automated processing of a project's Job Description to auto-extract required skills.
   * @param {number|string} projectId - Project ID
   * @returns {Promise<Object>} JobDescriptionProcessingResponse { projectId, status, detectedSkills }
   */
  processJobDescription: (projectId) => axiosClient.post(`/managers/projects/${projectId}/job-description/process`),
};

export default jobDescriptionApi;
