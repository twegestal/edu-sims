import { useExamination } from '../hooks/useExamination.js';

export const fetchCategoryNames = async (examinationStep) => {
  const { getExaminationTypes } = useExamination();
  const categoryNamesMap = {};

  for (const category of Object.keys(examinationStep.examination_to_display)) {
    const categoryName = await getExaminationTypes(category);
    categoryNamesMap[category] = categoryName;
  }

  return categoryNamesMap;
};

export const fetchSubCategoryNames = async (examinationStep) => {
  const { getExaminationSubtypes } = useExamination();
  const subCategoryNamesMap = {};

  for (const category of Object.keys(examinationStep.examination_to_display)) {
    const subCategories = examinationStep.examination_to_display[category];

    for (const subCategory of subCategories) {
      const subCategoryName = await getExaminationSubtypes(subCategory);
      subCategoryNamesMap[subCategory] = subCategoryName;
    }
  }

  return subCategoryNamesMap;
};

export const fetchStepValues = async (stepId) => {
  const { getExaminationSpecificValues } = useExamination();
  const stepValuesMap = {};
  const stepValuesResponse = await getExaminationSpecificValues(stepId);

  for (let i = 0; i < stepValuesResponse.length; i++) {
    const newPair = {
      value: stepValuesResponse[i].value,
      isNormal: stepValuesResponse[i].is_normal,
      userHasTested: false,
    };
    stepValuesMap[stepValuesResponse[i].examination_id] = newPair;
  }

  return stepValuesMap;
};

export const fetchExaminationList = async (subCategoryNames) => {
  const { getExaminationList } = useExamination();
  const examinationsMap = {};

  for (const subCategoryId of Object.keys(subCategoryNames)) {
    const examinationsResponse = await getExaminationList(subCategoryId);
    const entry = {};
    for (let i = 0; i < examinationsResponse.length; i++) {
      const id = examinationsResponse[i].id;
      const name = examinationsResponse[i].name;

      entry[id] = name;
    }
    examinationsMap[subCategoryId] = entry;
  }
  return examinationsMap;
};

export const updateResults = (examinationsToRun, examinations) => {
  const resultsMap = {};

  for (let i = 0; i < examinationsToRun.length; i++) {
    if (stepSpecificValues.hasOwnProperty(examinationsToRun[i])) {
      setStepSpecificValues({
        ...stepSpecificValues,
        ...(stepSpecificValues[examinationsToRun[i]].userHasTested = true),
      });

      let examinationName = '';

      for (const subCategory of Object.keys(examinations)) {
        for (const examinationId of Object.keys(examinations[subCategory])) {
          if (examinationId === examinationsToRun[i]) {
            examinationName = examinations[subCategory][examinationId];
          }
        }
      }

      resultsMap[examinationsToRun[i]] = {
        name: examinationName,
        value: stepSpecificValues[examinationsToRun[i]].value,
        isNormal: stepSpecificValues[examinationsToRun[i]].isNormal,
      };
    } else {
      let examinationName = '';

      for (const subCategory of Object.keys(examinations)) {
        for (const examinationId of Object.keys(examinations[subCategory])) {
          if (examinationId === examinationsToRun[i]) {
            examinationName = examinations[subCategory][examinationId];
          }
        }
      }

      resultsMap[examinationsToRun[i]] = {
        name: examinationName,
        value: 'Normalvärde',
        isNormal: true,
      };
    }
  }

  return resultsMap;
};
