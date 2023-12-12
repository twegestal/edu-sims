import { packageResponse } from '../utils/apiUtils.js';
import { api } from './index.js';
const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (body) => {
    const response = apiClient.post(`${prefix}createCase`, body);
    return packageResponse(response);
  },

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

  addMedicalField: async (body) => {
    const response = await apiClient.post(`${prefix}medicalField`, body);
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

  addNewDiagnosis: async (body) => {
    const response = await apiClient.post(`${prefix}diagnosis`, body);
    return packageResponse(response);
  },

  updateDiagnosis: async (body) => {
    const response = await apiClient.patch(`${prefix}diagnosis`, body);
    return packageResponse(response);
  },

  deleteDiagnosis: async (body) => {
    const response = await apiClient.delete(`${prefix}diagnosis`, body);
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

  createAttempt: async (headers) => {
    const response = await apiClient.post(`${prefix}createAttempt`, headers);
    return packageResponse(response);
  },

  updateAttempt: async (headers) => {
    const response = await apiClient.put(`${prefix}updateAttempt`, headers);
    return packageResponse(response);
  },

  /* publishCase: async (headers) => { // detta är väl en duplicate va????
    const response = await apiClient.put(`${prefix}publishCase`, headers);
    
    return packageResponse(response);
  }, */

  publishCase: async (headers) => {
    const response = await apiClient.put(`${prefix}publishCase`, headers);
    return packageResponse(response);
  },

  getAllExaminationTypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationTypes`, headers);
    return packageResponse(response);
  },

  getAllExaminationSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationSubtypes`, headers);
    return packageResponse(response);
  },

  getModuleTypes: async () => {
    const response = await apiClient.get(`${prefix}getModuleTypes`);
    return packageResponse(response);
  },
});
