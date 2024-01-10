import { useState, useEffect, useRef } from 'react';
import { useExamination } from './useExamination.js';

export const useExaminationUtils = (examinationStep, stepId, loading) => {
  const {
    getExaminationTypes,
    getExaminationSubtypes,
    getExaminationSpecificValues,
    getExaminationList,
  } = useExamination();

  const [categoryNames, setCategoryNames] = useState({});
  const [subCategoryNames, setSubCategoryNames] = useState({});
  const [stepValues, setStepValues] = useState({});
  const [examinationList, setExaminationList] = useState({});
  const [examinationsFetched, setExaminationsFetched] = useState(false);

  useEffect(() => {
    if (!loading) {
      fetchCategoryNames();
      fetchSubCategoryNames();
      fetchStepValues();
    }
  }, [examinationStep]);

  useEffect(() => {
    if (!loading) {
      fetchExaminationList();
    }
  }, [subCategoryNames]);

  const fetchCategoryNames = async () => {
    const categoryNamesMap = {};

    for (const category of Object.keys(examinationStep.examination_to_display)) {
      const categoryName = await getExaminationTypes(category);
      categoryNamesMap[category] = categoryName;
    }
    setCategoryNames(categoryNamesMap);
  };

  const fetchSubCategoryNames = async () => {
    const subCategoryNamesMap = {};

    for (const category of Object.keys(examinationStep.examination_to_display)) {
      const subCategories = examinationStep.examination_to_display[category];

      for (const subCategory of subCategories) {
        const subCategoryName = await getExaminationSubtypes(subCategory);
        subCategoryNamesMap[subCategory] = subCategoryName;
      }
    }
    setSubCategoryNames(subCategoryNamesMap);
  };

  const fetchStepValues = async () => {
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
    setStepValues(stepValuesMap);
  };

  const fetchExaminationList = async () => {
    const listMap = {};
    for (const subCategoryId of Object.keys(subCategoryNames)) {
      const examinationsResponse = await getExaminationList(subCategoryId);
      const entry = {};
      for (let i = 0; i < examinationsResponse.length; i++) {
        entry[examinationsResponse[i].id] = {
          name: examinationsResponse[i].name,
          minValue: examinationsResponse[i].min_value,
          maxValue: examinationsResponse[i].max_value,
          isRandomizable: examinationsResponse[i].is_randomizable,
          examinationSubtypeId: examinationsResponse[i].examination_subtype_id,
          unit: examinationsResponse[i].unit,
        };
      }
      listMap[subCategoryId] = entry;
    }
    setExaminationsFetched(true);
    setExaminationList(listMap);
  };

  const updateResults = (examinationsToRun, examinations) => {
    const resultsMap = {};

    for (let i = 0; i < examinationsToRun.length; i++) {
      if (stepValues.hasOwnProperty(examinationsToRun[i])) {
        setStepValues({
          ...stepValues,
          ...(stepValues[examinationsToRun[i]].userHasTested = true),
        });

        let examinationName = '';

        for (const subCategory of Object.keys(examinations)) {
          for (const examinationId of Object.keys(examinations[subCategory])) {
            if (examinationId === examinationsToRun[i]) {
              examinationName = examinations[subCategory][examinationId].name;
            }
          }
        }

        let examination = null;
        for (const examinationSubCategoryId of Object.keys(examinationList)) {
          for (const examinationIdSearch of Object.keys(
            examinationList[examinationSubCategoryId],
          )) {
            if (examinationIdSearch === examinationsToRun[i]) {
              examination = examinationList[examinationSubCategoryId][examinationIdSearch];
            }
          }
        }
        if (examination.isRandomizable) {
          const unit = examination.unit;
          const minValue = Number.parseFloat(examination.minValue.replace(',', '.'));
          const maxValue = Number.parseFloat(examination.maxValue.replace(',', '.'));
          resultsMap[examinationsToRun[i]] = {
            name: examinationName,
            value: `${
              stepValues[examinationsToRun[i]].value
            } ${unit} (${minValue} - ${maxValue} ${unit})`,
            isNormal: stepValues[examinationsToRun[i]].isNormal,
          };
        } else {
          resultsMap[examinationsToRun[i]] = {
            name: examinationName,
            value: `${stepValues[examinationsToRun[i]].value}`,
            isNormal: stepValues[examinationsToRun[i]].isNormal,
          };
        }
      } else {
        let examinationName = '';

        for (const subCategory of Object.keys(examinations)) {
          for (const examinationId of Object.keys(examinations[subCategory])) {
            if (examinationId === examinationsToRun[i]) {
              examinationName = examinations[subCategory][examinationId].name;
            }
          }
        }

        resultsMap[examinationsToRun[i]] = {
          name: examinationName,
          value: randomizeNormalValue(examinationsToRun[i]),
          isNormal: true,
        };
      }
    }

    return resultsMap;
  };

  const randomizeNormalValue = (examinationId) => {
    let examination = null;
    for (const examinationSubCategoryId of Object.keys(examinationList)) {
      for (const examinationIdSearch of Object.keys(examinationList[examinationSubCategoryId])) {
        if (examinationIdSearch === examinationId) {
          examination = examinationList[examinationSubCategoryId][examinationIdSearch];
        }
      }
    }

    if (examination.isRandomizable) {
      let randomizedValue = 0;
      const maxValue = Number.parseFloat(examination.maxValue.replace(',', '.'));
      const minValue = Number.parseFloat(examination.minValue.replace(',', '.'));

      randomizedValue = Math.random() * (maxValue - minValue) + minValue;

      return `${randomizedValue.toFixed(2)} ${examination.unit} (${minValue} - ${maxValue} ${
        examination.unit
      })`;
    }

    return 'Normalvärde';
  };

  return {
    categoryNames,
    subCategoryNames,
    stepValues,
    examinationList,
    examinationsFetched,
    updateResults,
  };
};
