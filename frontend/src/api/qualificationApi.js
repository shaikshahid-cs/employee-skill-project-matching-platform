import axiosClient from './axiosClient';

/**
 * Qualification API Service Module
 * Handles endpoints exposed by CertificationController (/api/certifications) & EducationController (/api/employees/education)
 */
export const qualificationApi = {
  // --- CERTIFICATIONS ---

  /**
   * Endpoint #23: POST /api/certifications
   * Adds a professional certification entry.
   * @param {Object} data - CertificationRequest { name, issuingOrganization, issueDate, expiryDate }
   * @returns {Promise<Object>} CertificationResponse
   */
  addCertification: (data) => axiosClient.post('/certifications', data),

  /**
   * Endpoint #24: GET /api/certifications
   * Retrieves all certifications for the authenticated employee.
   * @returns {Promise<Array>} List<CertificationResponse>
   */
  getCertifications: () => axiosClient.get('/certifications'),

  /**
   * Endpoint #25: GET /api/certifications/{id}
   * Retrieves a single certification by ID.
   * @param {number|string} id - Certification ID
   * @returns {Promise<Object>} CertificationResponse
   */
  getCertificationById: (id) => axiosClient.get(`/certifications/${id}`),

  /**
   * Endpoint #26: PUT /api/certifications/{id}
   * Updates an existing certification entry.
   * @param {number|string} id - Certification ID
   * @param {Object} data - CertificationRequest
   * @returns {Promise<Object>} CertificationResponse
   */
  updateCertification: (id, data) => axiosClient.put(`/certifications/${id}`, data),

  /**
   * Endpoint #27: DELETE /api/certifications/{id}
   * Deletes a certification entry.
   * @param {number|string} id - Certification ID
   * @returns {Promise<void>} 204 No Content
   */
  deleteCertification: (id) => axiosClient.delete(`/certifications/${id}`),

  // --- EDUCATION ---

  /**
   * Endpoint #28: POST /api/employees/education
   * Adds an education background entry.
   * @param {Object} data - EducationRequest { degree, field, institution, graduationYear }
   * @returns {Promise<Object>} EducationResponse
   */
  addEducation: (data) => axiosClient.post('/employees/education', data),

  /**
   * Endpoint #29: GET /api/employees/education
   * Retrieves all education entries for the authenticated employee.
   * @returns {Promise<Array>} List<EducationResponse>
   */
  getEducations: () => axiosClient.get('/employees/education'),

  /**
   * Endpoint #30: GET /api/employees/education/{id}
   * Retrieves a single education entry by ID.
   * @param {number|string} id - Education ID
   * @returns {Promise<Object>} EducationResponse
   */
  getEducationById: (id) => axiosClient.get(`/employees/education/${id}`),

  /**
   * Endpoint #31: PUT /api/employees/education/{id}
   * Updates an education background record.
   * @param {number|string} id - Education ID
   * @param {Object} data - EducationRequest
   * @returns {Promise<Object>} EducationResponse
   */
  updateEducation: (id, data) => axiosClient.put(`/employees/education/${id}`, data),

  /**
   * Endpoint #32: DELETE /api/employees/education/{id}
   * Deletes an education record.
   * @param {number|string} id - Education ID
   * @returns {Promise<void>} 204 No Content
   */
  deleteEducation: (id) => axiosClient.delete(`/employees/education/${id}`),
};

export default qualificationApi;
