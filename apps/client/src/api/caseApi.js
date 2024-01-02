import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (body) => {
    const response = await apiClient.post(`${prefix}`, body);
    return packageResponse(response);
  },

  updateCase: async (body) => {
    const response = await apiClient.patch(`${prefix}`, body);
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

  updateMedicalField: async (body) => {
    const response = await apiClient.patch(`${prefix}medicalField`, body);
    return packageResponse(response);
  },

  deleteMedicalField: async (body) => {
    const response = await apiClient.delete(`${prefix}medicalField`, body);
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

  addNewExaminationType: async (body) => {
    const response = await apiClient.post(`${prefix}examinationType`, body);
    return packageResponse(response);
  },

  addNewExaminationSubtype: async (body) => {
    const response = await apiClient.post(`${prefix}examinationSubtype`, body);
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

  addNewTreatmentType: async (body) => {
    const response = await apiClient.post(`${prefix}treatmentTypes`, body);
    return packageResponse(response);
  },

  editTreatmentType: async (body) => {
    const response = await apiClient.patch(`${prefix}treatmentType`, body);
    return packageResponse(response);
  },

  deleteTreatmentType: async (body) => {
    const response = await apiClient.delete(`${prefix}treatmentType`, body);
    return packageResponse(response);
  },

  getTreatmentSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getTreatmentSubtypes`, headers);
    return packageResponse(response);
  },

  addNewTreatmentSubtype: async (body) => {
    const response = await apiClient.post(`${prefix}treatmentSubtypes`, body);
    return packageResponse(response);
  },

  editTreatmentSubtype: async (body) => {
    const response = await apiClient.patch(`${prefix}treatmentSubtypes`, body);
    return packageResponse(response);
  },

  deleteTreatmentSubtype: async (body) => {
    const response = await apiClient.delete(`${prefix}treatmentSubtype`, body);
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

  addNewTreatment: async (body) => {
    const response = await apiClient.post(`${prefix}treatment`, body);
    return packageResponse(response);
  },

  updateTreatment: async (body) => {
    const response = await apiClient.patch(`${prefix}treatment`, body);
    return packageResponse(response);
  },

  deleteTreatment: async (body) => {
    const response = await apiClient.delete(`${prefix}treatment`, body);
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

  publishCase: async (headers) => {
    const response = await apiClient.put(`${prefix}publishCase`, headers);
    return packageResponse(response);
  },

  getAllExaminationTypes: async (headers) => {
    const response = await apiClient.get(`${prefix}getExaminationTypes`, headers);
    return packageResponse(response);
  },

  addNewExamination: async (body) => {
    const response = await apiClient.post(`${prefix}examination`, body);
    return packageResponse(response);
  },

  updateExamination: async (body) => {
    const response = await apiClient.patch(`${prefix}examination`, body);
    return packageResponse(response);
  },

  deleteExamination: async (body) => {
    const response = await apiClient.delete(`${prefix}examination`, body);
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
