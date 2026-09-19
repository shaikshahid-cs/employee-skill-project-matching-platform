import axiosClient from './axiosClient';

/**
 * Assistive Document API Service Module
 * Connects to AssistiveDocumentService for resume and job description parsing & review
 */
export const documentApi = {
  /**
   * Parses resume document and returns structured preview with confidence ratings
   * @param {File} file
   */
  extractResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/employee/resume/extract', formData);
  },

  /**
   * Applies user-verified resume extraction data to employee profile, skills, education, certs, and experience
   * @param {Object} verifiedData
   */
  applyResume: (verifiedData) => axiosClient.post('/employee/resume/apply', verifiedData),

  /**
   * Parses JD document and returns structured preview with confidence ratings
   * @param {File} file
   */
  extractJobDescription: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/manager/jd/extract', formData);
  },

  /**
   * Applies verified JD requirements to project
   * @param {number|string} projectId
   * @param {Object} verifiedData
   */
  applyJobDescription: (projectId, verifiedData) =>
    axiosClient.post(`/manager/jd/projects/${projectId}/apply`, verifiedData),
};

export default documentApi;
