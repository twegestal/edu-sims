import { useState } from 'react';
import { useApi } from './useApi.js';

export const useDiagnosis = () => {
  const getDiagnosisStepApi = useApi('getDiagnosisStep');
  const getDiagnosisListApi = useApi('getDiagnosisList');

  const [diagnosisStep, setDiagnosisStep] = useState({});
  const [diagnosisList, setDiagnosisList] = useState([]);

  const getDiagnosisStep = async (id) => {
    try {
      const response = await getDiagnosisStepApi({ headers: { id: id } });
      setDiagnosisStep(response);
    } catch (error) {
      console.error('error fetching diagnosis step: ', error);
    }
  };

  const getDiagnosisList = async (id) => {
    try {
      const response = await getDiagnosisListApi({ headers: { id: id } });
      setDiagnosisList(response);
    } catch (error) {
      console.error('error fetching diagnosis list, ', error);
    }
  };
  return { diagnosisStep, getDiagnosisStep, diagnosisList, getDiagnosisList };
};
