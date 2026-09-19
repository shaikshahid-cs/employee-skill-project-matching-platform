import axiosClient from './axiosClient';

/**
 * Project Management & Assignment API Service Module
 * Handles endpoints exposed by ProjectController (/api/manager/projects) and EmployeeAssignmentController (/api/employee/assignments)
 */
export const projectApi = {
  createProject: (data) => axiosClient.post('/manager/projects', data),

  getManagerProjects: () => axiosClient.get('/manager/projects'),

  getProjectById: (id) => axiosClient.get(`/manager/projects/${id}`),

  updateProject: (id, data) => axiosClient.put(`/manager/projects/${id}`, data),

  deleteProject: (id) => axiosClient.delete(`/manager/projects/${id}`),

  // Team assignments
  assignEmployee: (projectId, employeeId, role) =>
    axiosClient.post(`/manager/projects/${projectId}/assignments`, { employeeId, role }),

  unassignEmployee: (projectId, employeeId) =>
    axiosClient.delete(`/manager/projects/${projectId}/assignments/${employeeId}`),

  getProjectAssignments: (projectId) =>
    axiosClient.get(`/manager/projects/${projectId}/assignments`),

  // Employee side assignments
  getMyAssignedProjects: () => axiosClient.get('/employee/assignments'),

  // Open projects discovery
  getOpenProjects: () => axiosClient.get('/projects/open'),

  getRecommendedProjects: () => axiosClient.get('/projects/recommendations'),
};

export default projectApi;
