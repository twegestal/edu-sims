import { useState } from 'react';

export const useExamination = () => {
  const getExaminationSpecificValuesApi = useApi('getExaminationSpecificValues');
  const getExaminationStepApi = useApi('getExaminationStep');
  const getExaminationTypesApi = useApi('getExaminationTypes');
  const getExaminationSubtypesApi = useApi('getExaminationSubtypes');
  const getExaminationListApi = useApi('getExaminationList');

  const [examionationSpecificValues, setExaminationSpecificValues] = useState({});
  const [examinationStep, setExaminationStep] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState({});
  const [examinationSubtypes, setExaminationSubtypes] = useState({});
  const [examinationList, setExaminationList] = useState({});

  const getExaminationSpecificValues = async (id) => {
    try {
      const result = await getExaminationSpecificValuesApi({ headers: { step_id: id } });
      setExaminationSpecificValues(result);
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
      const result = await getExaminationTypesApi({ headers: { id: id } });
      setExaminationTypes(result);
    } catch (error) {
      console.error('error fetching examinationt type: ', error);
    }
  };

  const getExaminationSubtypes = async (id) => {
    try {
      const result = await getExaminationSubtypesApi({ headers: { examination_type_id: id } });
      setExaminationSubtypes(result);
    } catch (error) {
      console.error('error fetching examination suntypes: ', error);
    }
  };

  const getExaminationList = async (id) => {
    try {
      const result = await getExaminationListApi({ headers: { examination_subtype_id: id } });
      setExaminationList(result);
    } catch (error) {
      console.error('error fetching examination list: ', error);
    }
  };

  return {
    examionationSpecificValues,
    examinationStep,
    examinationTypes,
    examinationSubtypes,
    examinationList,
    getExaminationSpecificValues,
    getExaminationStep,
    getExaminationTypes,
    getExaminationSubtypes,
    getExaminationList,
  };
};
