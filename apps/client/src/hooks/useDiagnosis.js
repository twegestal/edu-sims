import { useState } from 'react';
import { useApi } from './useApi.js';

export const useDiagnosis = () => {
  const getDiagnosisStepApi = useApi('getDiagnosisStep');
  const getDiagnosisListApi = useApi('getDiagnosisList');
  const addNewDiagnosisApi = useApi('addNewDiagnosis');
  const updateDiagnosisApi = useApi('updateDiagnosis');
  const deleteDiagnosisApi = useApi('deleteDiagnosis');

  const [diagnosisStep, setDiagnosisStep] = useState({});
  const [diagnosisList, setDiagnosisList] = useState([]);

  const getDiagnosisStep = async (id) => {
    try {
      const response = await getDiagnosisStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setDiagnosisStep(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('error fetching diagnosis step: ', error);
    }
  };

  const getDiagnosisList = async (id) => {
    try {
      const response = await getDiagnosisListApi({ headers: { id: id } });
      if (response.status === 200) {
        setDiagnosisList(response.data);
      }
    } catch (error) {
      console.error('error fetching diagnosis list ', error);
    }
  };

  const addNewDiagnosis = async (name, medicalFieldId) => {
    try {
      const response = await addNewDiagnosisApi({
        body: { name: name, medical_field_id: medicalFieldId },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new diagnosis ', error);
    }
  };

  const updateDiagnosis = async (newName, id) => {
    try {
      const response = await updateDiagnosisApi({ body: { newName: newName, id: id } });
      return response.status === 200;
    } catch (error) {
      console.error('error updating diagnosis ', error);
    }
  };

  const deleteDiagnosis = async (id) => {
    try {
      const response = await deleteDiagnosisApi({ body: { id: id } });
      return response.status;
    } catch (error) {
      console.error('error deleting diagnosis', error);
      return error.response.status;
    }
  };
  return {
    diagnosisStep,
    getDiagnosisStep,
    diagnosisList,
    getDiagnosisList,
    addNewDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    setDiagnosisList,
  };
};
