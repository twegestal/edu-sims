const prefix = '/case/';

export const caseApi = (apiClient) => ({
  createCase: async (data) => apiClient.post(`${prefix}createCase`, { json: data }).json(),

  getAllCases: async () => apiClient.get(`${prefix}getAllCases`).json(),

  getCaseById: async () => apiClient.get(`${prefix}getCaseById`).json(),

  getMedicalFields: async () => apiClient.get(`${prefix}getMedicalFields`).json(),

  getIntroductionStep: async () => apiClient.get(`${prefix}getIntroductionStep`).json(),

  getDiagnosisStep: async () => apiClient.get(`${prefix}getDiagnosisStep`).json(),

  getDiagnosisList: async () => apiClient.get(`${prefix}getDiagnosisList`).json(),

  getSummaryStep: async () => apiClient.get(`${prefix}getSummaryStep`).json(),

  getExaminationSpecificValues: async () =>
    apiClient.get(`${prefix}getExaminationSpecificValues`).json(),

  getExaminationStep: async () => apiClient.get(`${prefix}getExaminationStep`).json(),

  getExaminationTypes: async () => apiClient.get(`${prefix}getExaminationTypes`).json(),

  getExaminationSubtypes: async () => apiClient.get(`${prefix}getExaminationSubtypes`).json(),

  getExaminationList: async () => apiClient.get(`${prefix}getExaminationList`).json(),

  getTreatmentStep: async () => apiClient.get(`${prefix}getTreatmentStep`).json(),

  getTreatmentTypes: async () => apiClient.get(`${prefix}getTreatmentTypes`).json(),

  getTreatmentSubtypes: async () => apiClient.get(`${prefix}getTreatmentSubtypes`).json(),

  getTreatmentList: async () => apiClient.get(`${prefix}getTreatmentList`).json(),

  getTreatmentSpecificValues: async () =>
    apiClient.get(`${prefix}getTreatmentSpecificValues`).json(),
});
