import { useApi } from './useApi';

export const useTreatment = () => {
  const getTreatmentStepApi = useApi('getTreatmentStep');
  const getTreatmentTypesApi = useApi('getTreatmentTypes');
  const getTreatmentSubtypesApi = useApi('getTreatmentSubtypes');
  const getTreatmentListApi = useApi('getTreatmentList');
  const getTreatmentSpecificValuesApi = useApi('getTreatmentSpecificValues');
};
