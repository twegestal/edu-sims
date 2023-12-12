import { useState } from 'react';
import { useApi } from './useApi.js';

export const useExamination = () => {
  const getExaminationSpecificValuesApi = useApi('getExaminationSpecificValues');
  const getExaminationStepApi = useApi('getExaminationStep');
  const getExaminationTypesApi = useApi('getExaminationTypes');
  const getExaminationSubtypesApi = useApi('getExaminationSubtypes');
  const getExaminationListApi = useApi('getExaminationList');
  const addNewExaminationApi = useApi('addNewExamination');
  const updateExaminationApi = useApi('updateExamination');
  const deleteExaminationApi = useApi('deleteExamination');
  const addNewExaminationTypeApi = useApi('addNewExaminationType');
  const addNewExaminationSubtypeApi = useApi('addNewExaminationSubtype');

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

  const addNewExamination = async (name, subtypeId, examinationTypeId) => {
    try {
      const response = await addNewExaminationApi({
        body: { name: name, subtypeId: subtypeId, examinationTypeId: examinationTypeId },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new examination ', error);
    }
  };

  const updateExamination = async (newName, id) => {
    try {
      const response = await updateExaminationApi({ body: { id: id, newName: newName } });
      return response.status === 200;
    } catch (error) {
      console.error('Error updating examination ', error);
    }
  };

  const deleteExamination = async (id) => {
    try {
      const response = await deleteExaminationApi({ body: { id: id } });
      return response.status;
    } catch (error) {
      console.error('error removing examination ', error);
      return error.response.status;
    }
  };

  const addNewExaminationType = async (name) => {
    try {
      const response = await addNewExaminationTypeApi({ body: { name: name } });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new examination type ', error);
    }
  };

  const addNewExaminationSubtype = async (name, id) => {
    try {
      const response = await addNewExaminationSubtypeApi({ body: { name: name, id: id } });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new examination subtype ', error);
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
    addNewExamination,
    updateExamination,
    deleteExamination,
    addNewExaminationType,
    addNewExaminationSubtype,
  };
};
