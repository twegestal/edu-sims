import { useState } from 'react';
import { useApi } from './useApi';

export const useCreateCase = () => {
  const getAllExaminationTypesApi = useApi('getAllExaminationTypes');
  const getAllExaminationSubtypesApi = useApi('getAllExaminationSubtypes');
  const getTreatmentTypesApi = useApi('getTreatmentTypes');
  const getTreatmentSubtypesApi = useApi('getTreatmentSubtypes');
  const getTreatmentListApi = useApi('getTreatmentList');

  const getAllExaminationTypes = async (id) => {
    try {
      const result = await getAllExaminationTypesApi({ headers: { id: id } });
      if (result) {
        return result;
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
        return result;
      }
    } catch (error) {
      console.error('Error fetching examination subtypes', error);
    }
  };

  const getTreatmentTypes = async () => {
    try {
      const result = await getTreatmentTypesApi();
      if (result) {
        return result;
      }
    } catch (error) {
      console.error('error fetching treatment types: ', error);
    }
  };

  const getTreatmentSubtypes = async (id) => {
    try {
        const result = await getTreatmentSubtypesApi({ headers: { id: id } });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error('error fetching treatment subtypes: ', error); 
    }
  }
  
  const getTreatmentList = async (treatmentSubtypeId) => {
    try {
        const result = await getTreatmentListApi({ headers: { treatment_subtype_id: treatmentSubtypeId } });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error('error fetching treatment list: ', error); 
    }
  }

  return {
    getAllExaminationTypes,
    getAllExaminationSubtypes,
    getTreatmentTypes,
    getTreatmentSubtypes,
    getTreatmentList
  };
};
