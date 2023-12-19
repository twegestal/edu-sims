import { useState } from 'react';
import { useApi } from './useApi';

export const useCreateCase = () => {
  const getAllExaminationTypesApi = useApi('getAllExaminationTypes');
  const getAllExaminationSubtypesApi = useApi('getAllExaminationSubtypes');
  const getTreatmentTypesApi = useApi('getTreatmentTypes');
  const getTreatmentSubtypesApi = useApi('getTreatmentSubtypes');
  const getTreatmentListApi = useApi('getTreatmentList');
  const createCaseApi = useApi('createCase');
  const updateCaseApi = useApi('updateCase');
  const getExaminationListApi = useApi('getExaminationList');
  const getModuleTypesApi = useApi('getModuleTypes');

  const [moduleTypes, setModuleTypes] = useState();

  const getAllExaminationTypes = async (id) => {
    try {
      const result = await getAllExaminationTypesApi({ headers: { id: id } });
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('Error fetching all examination types', error);
    }
  };

  const getAllExaminationSubtypes = async (examination_type_id) => {
    try {
      const result = await getAllExaminationSubtypesApi({
        headers: { examination_type_id: examination_type_id },
      });
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('Error fetching examination subtypes', error);
    }
  };

  const getExaminationList = async (examinationSubtypeId) => {
    try {
      const result = await getExaminationListApi({
        headers: {
          examination_subtype_id: examinationSubtypeId,
        },
      });

      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('error fetching examination list', error);
    }
  };

  const getTreatmentTypes = async () => {
    try {
      const result = await getTreatmentTypesApi();
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('error fetching treatment types: ', error);
    }
  };

  const getTreatmentSubtypes = async (id) => {
    try {
      const result = await getTreatmentSubtypesApi({ headers: { id: id } });
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('error fetching treatment subtypes: ', error);
    }
  };

  const getTreatmentList = async (treatmentSubtypeId) => {
    try {
      const result = await getTreatmentListApi({
        headers: { treatment_subtype_id: treatmentSubtypeId },
      });
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.error('error fetching treatment list: ', error);
    }
  };

  const createCase = async (caseData) => {
    try {
      const response = await createCaseApi({ body: caseData });
      return response.status;
    } catch (error) {
      console.error('error creating case: ', error);
      return error.response.status;
    }
  };

  const updateCase = async (caseData, caseId, removedModules) => {
    try {
      const response = await updateCaseApi({
        body: { caseObject: caseData, caseId: caseId, removedModules: removedModules },
      });
      return response.status;
    } catch (error) {
      console.error('error updating case', error);
      return error.response.status;
    }
  };

  const getModuleTypes = async () => {
    try {
      const response = await getModuleTypesApi();

      if (response.status === 200) {
        setModuleTypes(response.data);
      }
    } catch (error) {
      console.error('error fetching module types: ', error);
    }
  };

  return {
    getAllExaminationTypes,
    getAllExaminationSubtypes,
    getExaminationList,
    getTreatmentTypes,
    getTreatmentSubtypes,
    getTreatmentList,
    createCase,
    updateCase,
    getModuleTypes,
    moduleTypes,
  };
};
