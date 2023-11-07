const useExamination = () => {
  const getExaminationSpecificValuesApi = useApi('getExaminationSpecificValues');
  const getExaminationStepApi = useApi('getExaminationStep');
  const getExaminationTypesApi = useApi('getExaminationTypes');
  const getExaminationSubtypesApi = useApi('getExaminationSubtypes');
  const getExaminationListApi = useApi('getExaminationList');
};
