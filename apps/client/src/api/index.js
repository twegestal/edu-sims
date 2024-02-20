import { authApi } from './authApi.js';
import { caseApi } from './caseApi.js';
import { userApi } from './userApi.js';
import { diagnosisApi } from './diagnosisApi.js';
import { statisticsApi } from './statisticsApi.js';
import { examinationApi } from './examinationApi.js';
import { medicalFieldApi } from './medicalFieldApi.js';
import { treatmentApi } from './treatmentApi.js';

export const api = (apiClient) =>
  Object.freeze({
    ...caseApi(apiClient),
    ...userApi(apiClient),
    ...authApi(apiClient),
    ...diagnosisApi(apiClient),
    ...examinationApi(apiClient),
    ...medicalFieldApi(apiClient),
    ...treatmentApi(apiClient),
    ...statisticsApi(apiClient),
  });
