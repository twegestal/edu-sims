import { useApi } from './useApi';

export const useCases = () => {
  const createCaseApi = useApi('createCase');
  const getAllCasesApi = useApi('getAllCases');
  const getCaseByIdApi = useApi('getCaseById');
  const getMedicalFieldsApi = useApi('getMedicalFields');
  const getIntroductionStep = useApi('getIntroductionStep');
  const getSummaryStepApi = useApi('getSummaryStep');
};
