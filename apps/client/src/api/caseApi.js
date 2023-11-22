import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (data) => apiClient.post(`${prefix}createCase`, { json: data }).json(),

  getAllCases: async () => {
    const response = await apiClient.get(`${prefix}getAllCases`);
    return packageResponse(response);
  },

  getCaseById: async (headers) => {
    const response = await apiClient.get(`${prefix}getCaseById`, headers);
    return packageResponse(response);
  },

  getMedicalFields: async () => {
    const response = await apiClient.get(`${prefix}getMedicalFields`);
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

  getDiagnosisList: async (headers) => {
    const response = await apiClient.get(`${prefix}getDiagnosisList`, headers);
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

  getExaminationTypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationTypes`, headers);
    return packageResponse(response);
  },

  getExaminationSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationSubtypes`, headers);
    return packageResponse(response);
  },

  getExaminationList: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationList`, headers);
    return packageResponse(response);
  },

  getTreatmentStep: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentStep`, headers);
    return packageResponse(response);
  },

  getTreatmentTypes: async () => {
    const response = await apiClient.get(`${prefix}getTreatmentTypes`);
    return packageResponse(response);
  },

  getTreatmentSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentSubtypes`, headers);
    return packageResponse(response);
  },

  getTreatmentList: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentList`, headers);
    return packageResponse(response);
  },

  getTreatmentSpecificValues: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentSpecificValues`, headers);
    return packageResponse(response);
  },

  publishCase: async (headers) => {
    const response = await apiClient.put(`${prefix}publishCase`, headers);
    return packageResponse(response);
  },
});
