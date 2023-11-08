import { useApi } from './useApi';

export const useCases = () => {
  const createCaseApi = useApi('createCase');
  const getAllCasesApi = useApi('getAllCases');
  const getCaseByIdApi = useApi('getCaseById');
  const getMedicalFieldsApi = useApi('getMedicalFields');
  const getIntroductionStep = useApi('getIntroductionStep');
  const getSummaryStepApi = useApi('getSummaryStep');

  const [cases, setCases] = useState([]);
  const [medicalFields, setMedicalFields] = useState([]);
  const [caseById, setCaseById] = useState([]);

  const getAllCases = async () => {
    try {
      const result = await getAllCasesApi();
      setCases[result];
    } catch (error) {
      console.log('Error fetching cases: ', error);
    }
  };

  const getMedicalFields = async () => {
    try {
      const result = await getMedicalFieldsApi();
      setMedicalFields(result);
    } catch (error) {
      console.log('error fetching medical fields: ', error);
    }
  };

  const getCaseById = async (id) => {
    try {
      const result = await getCaseByIdApi({ headers: { case_id: id } });
      setCaseById(result);
    } catch (error) {
      console.log('Error fetching case by id: ', error);
    }
  };
  return { cases, getAllCases, medicalFields, getMedicalFields, caseById, getCaseById };
};
