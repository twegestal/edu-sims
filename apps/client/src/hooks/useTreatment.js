import { useState } from 'react';
import { useApi } from './useApi';

export const useTreatment = () => {
  const getTreatmentStepApi = useApi('getTreatmentStep');
  const getTreatmentTypesApi = useApi('getTreatmentTypes');
  const getTreatmentSubtypesApi = useApi('getTreatmentSubtypes');
  const getTreatmentListApi = useApi('getTreatmentList');
  const getTreatmentSpecificValuesApi = useApi('getTreatmentSpecificValues');

  const [treatmentStep, setTreatmentStep] = useState({});
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  const [treatmentSpecificValues, setTreatmentSpecificValues] = useState([]);

  const getTreatmentStep = async (id) => {
    try {
      const result = await getTreatmentStepApi({ headers: { id: id } });
      if (result) {
        setTreatmentStep(result);
      }
    } catch (error) {
      console.error('error fetching treatment step: ', error);
    }
  };

  const getTreatmentSpecificValues = async (id) => {
    try {
      const result = await getTreatmentSpecificValuesApi({ headers: { id: id } });
      if (result) {
        setTreatmentSpecificValues(result);
      }
    } catch (error) {
      console.error('error fetching treatment specific values: ', error);
    }
  };

  const getTreatmentTypes = async () => {
    try {
      const result = await getTreatmentTypesApi();
      if (result) {
        setTreatmentTypes(result);
      }
    } catch (error) {
      console.error('error fetching treatment types: ', error);
    }
  };

  const getTreatmentList = async (id) => {
    try {
      return await getTreatmentListApi({ headers: { id: id } });
    } catch (error) {
      console.error('error fetching treatment list: ', error);
    }
  };

  return {
    getTreatmentStep,
    treatmentStep,
    getTreatmentSpecificValues,
    treatmentSpecificValues,
    getTreatmentTypes,
    treatmentTypes,
    getTreatmentList
  };
};
