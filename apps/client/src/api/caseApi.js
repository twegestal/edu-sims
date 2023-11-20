const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (data) => apiClient.post(`${prefix}createCase`, { json: data }).json(),

  getAllCases: async () => apiClient.get(`${prefix}getAllCases`).json(),

  getCaseById: async (headers) => apiClient.get(`${prefix}getCaseById`, headers).json(),

  getMedicalFields: async () => apiClient.get(`${prefix}getMedicalFields`).json(),

  getIntroductionStep: async (headers) =>
    apiClient.get(`${prefix}getIntroductionStep`, headers).json(),

  getDiagnosisStep: async (headers) => apiClient.get(`${prefix}getDiagnosisStep`, headers).json(),

  getDiagnosisList: async (headers) => apiClient.get(`${prefix}getDiagnosisList`, headers).json(),

  getSummaryStep: async (headers) => apiClient.get(`${prefix}getSummaryStep`, headers).json(),

  getExaminationSpecificValues: async (headers) =>
    apiClient.get(`${prefix}getExaminationSpecificValues`, headers).json(),

  getExaminationStep: async (headers) =>
    apiClient.get(`${prefix}getExaminationStep`, headers).json(),

  getExaminationTypes: async (headers) =>
    apiClient.get(`${prefix}getExaminationTypes`, headers).json(),

  getExaminationSubtypes: async (headers) =>
    apiClient.get(`${prefix}getExaminationSubtypes`, headers).json(),

  getExaminationList: async (headers) =>
    apiClient.get(`${prefix}getExaminationList`, headers).json(),

  getTreatmentStep: async (headers) => apiClient.get(`${prefix}getTreatmentStep`, headers).json(),

  getTreatmentTypes: async () => apiClient.get(`${prefix}getTreatmentTypes`).json(),

  getTreatmentSubtypes: async (headers) =>
    apiClient.get(`${prefix}getTreatmentSubtypes`, headers).json(),

  getTreatmentList: async (headers) => apiClient.get(`${prefix}getTreatmentList`, headers).json(),

  getTreatmentSpecificValues: async (headers) =>
    apiClient.get(`${prefix}getTreatmentSpecificValues`, headers).json(),

  publishCase: async (headers) => apiClient.put(`${prefix}publishCase`, headers).json(),

  getAllExaminationTypes: async (headers) =>
    apiClient.get(`${prefix}getExaminationTypes`, headers).json(),

  getAllExaminationSubtypes: async (headers) =>
    apiClient.get(`${prefix}getExaminationSubtypes`, headers).json(),
});
