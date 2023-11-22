import { packageResponse } from "../utils/apiUtils.js";
const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (data) => apiClient.post(`${prefix}createCase`, { json: data }).json(),

  getAllCases: async () => packageResponse(apiClient.get(`${prefix}getAllCases`)),

  getCaseById: async (headers) => packageResponse(apiClient.get(`${prefix}getCaseById`, headers)),

  getMedicalFields: async () => packageResponse(apiClient.get(`${prefix}getMedicalFields`)),

  getIntroductionStep: async (headers) => packageResponse(apiClient.get(`${prefix}getIntroductionStep`, headers)),

  getDiagnosisStep: async (headers) => packageResponse(apiClient.get(`${prefix}getDiagnosisStep`, headers)),

  getDiagnosisList: async (headers) => packageResponse(apiClient.get(`${prefix}getDiagnosisList`, headers)),

  getSummaryStep: async (headers) => packageResponse(apiClient.get(`${prefix}getSummaryStep`, headers)),

  getExaminationSpecificValues: async (headers) => packageResponse(apiClient.get(`${prefix}getExaminationSpecificValues`, headers)),

  getExaminationStep: async (headers) => packageResponse(apiClient.get(`${prefix}getExaminationStep`, headers)),

  getExaminationTypes: async (headers) => packageResponse(apiClient.get(`${prefix}getExaminationTypes`, headers)),

  getExaminationSubtypes: async (headers) => packageResponse(apiClient.get(`${prefix}getExaminationSubtypes`, headers)),

  getExaminationList: async (headers) => packageResponse(apiClient.get(`${prefix}getExaminationList`, headers)),

  getTreatmentStep: async (headers) => packageResponse(apiClient.get(`${prefix}getTreatmentStep`, headers)),

  getTreatmentTypes: async () => packageResponse(apiClient.get(`${prefix}getTreatmentTypes`)),

  getTreatmentSubtypes: async (headers) => packageResponse(apiClient.get(`${prefix}getTreatmentSubtypes`, headers)),

  getTreatmentList: async (headers) => packageResponse(apiClient.get(`${prefix}getTreatmentList`, headers)),

  getTreatmentSpecificValues: async (headers) => packageResponse(apiClient.get(`${prefix}getTreatmentSpecificValues`, headers)),

  publishCase: async (headers) => packageResponse(apiClient.put(`${prefix}publishCase`, headers)),
});
