import { useState } from 'react';

export const useDiagnosis = () => {
  const getDiagnosisStepApi = useApi('getDiagnosisStep');
  const getDiagnosisListApi = useApi('getDiagnosisList');

  const [diagnosisStep, setDiagnosisStep] = useState({});
  const [diagnosisList, setDiagnosisList] = useState([]);

  const getDiagnosisStep = async (id) => {
    try {
      const result = await getDiagnosisStepApi({ headers: { id: id } });
      setDiagnosisStep(result);
    } catch (error) {
      console.error('error fetching diagnosis step: ', error);
    }
  };

  const getDiagnosisList = async (id) => {
    try {
      const result = await getDiagnosisListApi({ headers: { id: id } });
      setDiagnosisList(result);
    } catch (error) {
      console.error('error fetching diagnosis list, ', error);
    }
  };
  return { diagnosisStep, getDiagnosisStep, diagnosisList, getDiagnosisList };
};
