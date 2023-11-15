import { useState } from 'react';
import { useApi } from './useApi.js';

export const useExamination = () => {
  const getExaminationSpecificValuesApi = useApi('getExaminationSpecificValues');
  const getExaminationStepApi = useApi('getExaminationStep');
  const getExaminationTypesApi = useApi('getExaminationTypes');
  const getExaminationSubtypesApi = useApi('getExaminationSubtypes');
  const getExaminationListApi = useApi('getExaminationList');

  const [examinationStep, setExaminationStep] = useState([]);

  const getExaminationSpecificValues = async (id) => {
    try {
      return await getExaminationSpecificValuesApi({ headers: { step_id: id } });
    } catch (error) {
      console.error('error fetching examination specific values: ', error);
    }
  };

  const getExaminationStep = async (id) => {
    try {
      const response = await getExaminationStepApi({ headers: { id: id } });
      setExaminationStep(response);
    } catch (error) {
      console.error('error fetching examination step: ', error);
    }
  };

  const getExaminationTypes = async (id) => {
    try {
      const response = await getExaminationTypesApi({ headers: { id: id } });
      if (response) {
        return response.name;
      }
    } catch (error) {
      console.error('error fetching examinationt type: ', error);
    }
  };

  const getExaminationSubtypes = async (id) => {
    try {
      const response = await getExaminationSubtypesApi({ headers: { id: id } });
      if (response) {
        return response.name;
      }
    } catch (error) {
      console.error('error fetching examination suntypes: ', error);
    }
  };

  const getExaminationList = async (id) => {
    try {
      return await getExaminationListApi({ headers: { examination_subtype_id: id } });
    } catch (error) {
      console.error('error fetching examination list: ', error);
    }
  };

  return {
    examinationStep,
    getExaminationSpecificValues,
    getExaminationStep,
    getExaminationTypes,
    getExaminationSubtypes,
    getExaminationList,
  };
};
