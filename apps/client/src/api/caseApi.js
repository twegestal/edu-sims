import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'case/';

export const caseApi = (apiClient) => ({

  getAllCases: async () => {
    const response = await apiClient.get(`${prefix}getAllCases`);
    return packageResponse(response);
  },

  getCaseById: async (headers) => {
    const response = await apiClient.get(`${prefix}getCaseById`, headers);
    return packageResponse(response);
  },

  createCase: async (body) => {
    const response = await apiClient.post(`${prefix}`, body);
    return packageResponse(response);
  },

  updateCase: async (body) => {
    const response = await apiClient.patch(`${prefix}`, body);
    return packageResponse(response);
  },

  deleteCase: async (body) => {
    const response = await apiClient.delete(`${prefix}`, body);
    return packageResponse(response);
  },

  getIntroductionStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getIntroductionStep`, headers);
    return packageResponse(response);
  },

  getDiagnosisStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getDiagnosisStep`, headers);
    return packageResponse(response);
  },

  getSummaryStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getSummaryStep`, headers);
    return packageResponse(response);
  },

  getExaminationSpecificValues: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationSpecificValues`, headers);
    return packageResponse(response);
  },

  getExaminationStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationStep`, headers);
    return packageResponse(response);
  },

  getTreatmentStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentStep`, headers);
    return packageResponse(response);
  },

  getTreatmentSpecificValues: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentSpecificValues`, headers);
    return packageResponse(response);
  },

  createAttempt: async (headers) => {
    const response = await apiClient.post(`${prefix}createAttempt`, headers);
    return packageResponse(response);
  },

  getAttempts: async (headers) => {
    const response = await apiClient.get(`${prefix}attempt`, headers);
    return packageResponse(response);
  },

  getSpecificAttempt: async (headers) => {
    const response = await apiClient.get(`${prefix}specificAttempt`, headers);
    return packageResponse(response);
  },

  updateAttempt: async (body) => {
    const response = await apiClient.put(`${prefix}updateAttempt`, body);
    return packageResponse(response);
  },

  publishCase: async (headers) => {
    const response = await apiClient.put(`${prefix}publishCase`, headers);
    return packageResponse(response);
  },

  getModuleTypes: async () => {
    const response = await apiClient.get(`${prefix}getModuleTypes`);
    return packageResponse(response);
  },
});
