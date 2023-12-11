import { useState } from 'react';
import { useApi } from './useApi.js';

export const useExamination = () => {
  const getExaminationSpecificValuesApi = useApi('getExaminationSpecificValues');
  const getExaminationStepApi = useApi('getExaminationStep');
  const getExaminationTypesApi = useApi('getExaminationTypes');
  const getExaminationSubtypesApi = useApi('getExaminationSubtypes');
  const getExaminationListApi = useApi('getExaminationList');

  const [examinationStep, setExaminationStep] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState();
  const [examinationSubtypes, setExaminationSubtypes] = useState();
  const [examinationList, setExaminationList] = useState();

  const getExaminationSpecificValues = async (id) => {
    try {
      const response = await getExaminationSpecificValuesApi({ headers: { step_id: id } });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('error fetching examination specific values: ', error);
    }
  };

  const getExaminationStep = async (id) => {
    try {
      const response = await getExaminationStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setExaminationStep(response.data);
      }
    } catch (error) {
      console.error('error fetching examination step: ', error);
    }
  };

  const getExaminationTypes = async (id) => {
    try {
      const response = await getExaminationTypesApi({ headers: { id: id } });
      if (response.status === 200) {
        setExaminationTypes(response.data);
        return response.data.name;
      }
    } catch (error) {
      console.error('error fetching examinationt type: ', error);
    }
  };

  const getExaminationSubtypes = async (id) => {
    try {
      const response = await getExaminationSubtypesApi({ headers: { id: id } });
      //console.log('subbies: ', response.data);
      if (response.status === 200) {
        setExaminationSubtypes(response.data);
        return response.data.name;
      }
    } catch (error) {
      console.error('error fetching examination suntypes: ', error);
    }
  };

  const getExaminationList = async (id) => {
    try {
      const response = await getExaminationListApi({ headers: { examination_subtype_id: id } });
      if (response.status === 200) {
        setExaminationList(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('error fetching examination list: ', error);
    }
  };

  return {
    examinationStep,
    getExaminationSpecificValues,
    getExaminationStep,
    examinationTypes,
    getExaminationTypes,
    examinationSubtypes,
    getExaminationSubtypes,
    examinationList,
    getExaminationList,
  };
};
