const prefix = 'case/';

export const caseApi = (apiClient) => ({
  createCase: async (data) => apiClient.post(`${prefix}createCase`, { json: data }).json(),

  getAllCases: async () => packageResponse(apiClient.get(`${prefix}getAllCases`)),

  getCaseById: async (headers) => packageResponse(apiClient.get(`${prefix}getCaseById`, headers)),

  getMedicalFields: async () => packageResponse(apiClient.get(`${prefix}getMedicalFields`)),

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
});

const packageResponse = async (response) => {
  return { status: response.status, headers: response.headers, data: await response.json() };
}
