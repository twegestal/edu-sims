import { useState } from 'react';
import { useApi } from './useApi';

export const useCreateCase = () => {
  const getAllExaminationTypesApi = useApi('getAllExaminationTypes');
  const getAllExaminationSubtypesApi = useApi('getAllExaminationSubtypes');

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

  return {
    getAllExaminationTypes,
    getAllExaminationSubtypes,
  };
};
