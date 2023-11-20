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


  const [cases, setCases] = useState([]);
  const [medicalFields, setMedicalFields] = useState([]);
  const [caseById, setCaseById] = useState([]);
  const [introductionStep, setIntroductionStep] = useState({});
  const [summaryStep, setSummaryStep] = useState({});
  const [newPublishment, setNewPublishment] = useState('');

  const getAllCases = async () => {
    try {
      const result = await getAllCasesApi();
      setCases(result);
    } catch (error) {
      console.error('Error fetching cases: ', error);
    }
  };

  const getMedicalFields = async () => {
    try {
      const result = await getMedicalFieldsApi();
      setMedicalFields(result);
    } catch (error) {
      console.error('error fetching medical fields: ', error);
    }
  };

  const getCaseById = async (id) => {
    try {
      const result = await getCaseByIdApi({ headers: { case_id: id } });
      setCaseById(result);
    } catch (error) {
      console.error('Error fetching case by id: ', error);
    }
  };

  const getIntroductionStep = async (id) => {
    try {
      const result = await getIntroductionStepApi({ headers: { id: id } });
      if (result) {
        setIntroductionStep(result);
      }
    } catch (error) {
      console.error('Error fetch introduction step', error);
    }
  };

  const getSummaryStep = async (id) => {
    try {
      const result = await getSummaryStepApi({ headers: { id: id } });
      if (result) {
        setSummaryStep(result);
      }
    } catch (error) {
      console.error('error fetch summary step: ', error);
    }
  };

  const publishCase = async (id, isPublished) => {
    try {
      const result = await publishCaseApi({ headers: { id: id, isPublished: isPublished} });
      if (result) {
        setNewPublishment(isPublished + id)
        return
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
    caseById,
    getCaseById,
    introductionStep,
    getIntroductionStep,
    getSummaryStep,
    summaryStep,
    publishCase,
    newPublishment,
  };
};
