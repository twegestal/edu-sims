import { useState } from 'react';
import { useApi } from './useApi';

export const useCases = () => {
  const createCaseApi = useApi('createCase');
  const getAllCasesApi = useApi('getAllCases');
  const getCaseByIdApi = useApi('getCaseById');
  const getMedicalFieldsApi = useApi('getMedicalFields');
  const getIntroductionStepApi = useApi('getIntroductionStep');
  const getSummaryStepApi = useApi('getSummaryStep');
  const publishCaseApi = useApi('publishCase');
  const createAttemptApi = useApi('createAttempt');
  const updateAttemptApi = useApi('updateAttempt');
  const addMedicalFieldApi = useApi('addMedicalField');

  const [cases, setCases] = useState([]);
  const [medicalFields, setMedicalFields] = useState([]);
  const [caseById, setCaseById] = useState([]);
  const [introductionStep, setIntroductionStep] = useState({});
  const [summaryStep, setSummaryStep] = useState({});
  const [newPublishment, setNewPublishment] = useState('');

  const getAllCases = async () => {
    try {
      const response = await getAllCasesApi();
      if (response.status === 200) {
        setCases(response.data);
      }
    } catch (error) {
      console.error('Error fetching cases: ', error);
    }
  };

  const getMedicalFields = async () => {
    try {
      const response = await getMedicalFieldsApi();
      if (response.status === 200) {
        setMedicalFields(response.data);
      }
    } catch (error) {
      console.error('error fetching medical fields: ', error);
    }
  };

  const addMedicalField = async (name) => {
    try {
      const response = await addMedicalFieldApi({ body: { name: name } });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new medical field ', error);
    }
  };

  const getCaseById = async (id) => {
    try {
      const response = await getCaseByIdApi({ headers: { case_id: id } });
      if (response.status === 200) {
        setCaseById(response.data);
      }
    } catch (error) {
      console.error('Error fetching case by id: ', error);
    }
  };

  const getIntroductionStep = async (id) => {
    try {
      const response = await getIntroductionStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setIntroductionStep(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetch introduction step', error);
    }
  };

  const getSummaryStep = async (id) => {
    try {
      const response = await getSummaryStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setSummaryStep(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('error fetch summary step: ', error);
    }
  };

  const publishCase = async (id, isPublished) => {
    try {
      const response = await publishCaseApi({ headers: { id: id, isPublished: isPublished } });
      if (response.status === 200) {
        setNewPublishment(isPublished + id);
        return;
      }
    } catch (error) {
      console.error('error updating case published state: ', error);
      if (error.response.status === 400) {
        const response = {
          errors: await error.response.json(),
        };
        return response;
      }
    }
  };

  const createAttempt = async (user_id, case_id) => {
    try {
      const result = await createAttemptApi({ headers: { user_id: user_id, case_id: case_id } });
      if (result.status === 200) {
        return result.data;
      }
    } catch (error) {
      console.error('error creating attempt: ', error);
    }
  };

  const updateAttempt = async (
    attempt_id,
    is_finished,
    faults,
    timestamp_finished,
    correct_diagnosis,
    nbr_of_tests_performed,
  ) => {
    try {
      const result = await updateAttemptApi({
        headers: {
          attempt_id: attempt_id,
          is_finished: is_finished,
          faults: faults,
          timestamp_finished: timestamp_finished,
          correct_diagnosis: correct_diagnosis,
          nbr_of_tests_performed: nbr_of_tests_performed,
        },
      });
      if (result.status === 200) {
        return;
      }
    } catch (error) {
      console.error('error fetch summary step: ', error);
    }
  };

  return {
    cases,
    getAllCases,
    medicalFields,
    getMedicalFields,
    addMedicalField,
    caseById,
    getCaseById,
    introductionStep,
    getIntroductionStep,
    getSummaryStep,
    summaryStep,
    publishCase,
    newPublishment,
    createAttempt,
    updateAttempt,
  };
};
