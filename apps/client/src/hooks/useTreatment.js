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
      const response = await getTreatmentStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setTreatmentStep(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment step: ', error);
    }
  };

  const getTreatmentSpecificValues = async (id) => {
    try {
      const response = await getTreatmentSpecificValuesApi({ headers: { id: id } });
      if (response.status === 200) {
        setTreatmentSpecificValues(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment specific values: ', error);
    }
  };

  const getTreatmentTypes = async () => {
    try {
      const response = await getTreatmentTypesApi();
      if (response.status === 200) {
        setTreatmentTypes(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment types: ', error);
    }
  };

  const getTreatmentList = async (id) => {
    try {
      const response = await getTreatmentListApi({ headers: { id: id } });
      if (response.status = 200) {
        return response.data;
      }
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
    getTreatmentList,
  };
};
