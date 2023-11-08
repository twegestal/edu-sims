import { useState } from 'react';

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
      const result = await getExaminationStepApi({ headers: { id: id } });
      setExaminationStep(result);
    } catch (error) {
      console.error('error fetching examination step: ', error);
    }
  };

  const getExaminationTypes = async (id) => {
    try {
      return await getExaminationTypesApi({ headers: { id: id } });
    } catch (error) {
      console.error('error fetching examinationt type: ', error);
    }
  };

  const getExaminationSubtypes = async (id) => {
    try {
      return await getExaminationSubtypesApi({ headers: { examination_type_id: id } });
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
