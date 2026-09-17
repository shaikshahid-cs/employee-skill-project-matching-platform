import axiosClient from './axiosClient';

/**
 * Resume Management API Service Module
 * Handles endpoints exposed by ResumeController (/api/employees/resume)
 */
export const resumeApi = {
  /**
   * Endpoint #17: POST /api/employees/resume
   * Uploads a resume document file (PDF/DOCX) using multipart form data.
   * @param {File} file - Resume file object
   * @returns {Promise<Object>} ResumeResponse { id, employeeId, fileName, processingStatus, uploadedAt }
   */
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/employees/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Endpoint #18: GET /api/employees/resume
   * Lists uploaded resumes for the authenticated employee.
   * @returns {Promise<Array>} List<ResumeResponse>
   */
  getResumes: () => axiosClient.get('/employees/resume'),

  /**
   * Endpoint #19: POST /api/employees/resume/{resumeId}/process
   * Triggers automated resume parsing and skill extraction for an uploaded resume.
   * @param {number|string} resumeId - Resume ID
   * @returns {Promise<Object>} ResumeProcessingResponse { resumeId, processingStatus, detectedSkills }
   */
  processResume: (resumeId) => axiosClient.post(`/employees/resume/${resumeId}/process`),
};

export default resumeApi;
