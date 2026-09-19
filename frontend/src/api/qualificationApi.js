import axiosClient from './axiosClient';

/**
 * Qualification & Experience API Service Module
 * Handles Certifications, Education, and Work Experience history
 */
export const qualificationApi = {
  // --- CERTIFICATIONS ---
  addCertification: (data) => axiosClient.post('/certifications', data),
  getCertifications: () => axiosClient.get('/certifications'),
  getCertificationById: (id) => axiosClient.get(`/certifications/${id}`),
  updateCertification: (id, data) => axiosClient.put(`/certifications/${id}`, data),
  deleteCertification: (id) => axiosClient.delete(`/certifications/${id}`),

  // --- EDUCATION ---
  addEducation: (data) => axiosClient.post('/employee/education', data),
  getEducations: () => axiosClient.get('/employee/education'),
  getEducationById: (id) => axiosClient.get(`/employee/education/${id}`),
  updateEducation: (id, data) => axiosClient.put(`/employee/education/${id}`, data),
  deleteEducation: (id) => axiosClient.delete(`/employee/education/${id}`),

  // --- EXPERIENCE ---
  addExperience: (data) => axiosClient.post('/employee/experience', data),
  getExperiences: () => axiosClient.get('/employee/experience'),
  updateExperience: (id, data) => axiosClient.put(`/employee/experience/${id}`, data),
  deleteExperience: (id) => axiosClient.delete(`/employee/experience/${id}`),
};

export const experienceApi = {
  getExperiences: qualificationApi.getExperiences,
  addExperience: qualificationApi.addExperience,
  updateExperience: qualificationApi.updateExperience,
  deleteExperience: qualificationApi.deleteExperience,
};

export default qualificationApi;
