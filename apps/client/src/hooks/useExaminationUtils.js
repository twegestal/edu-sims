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
  const [checkboxesChecked, setCheckboxesChecked] = useState({});

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

  useEffect(() => {
    if(examinationList) {
      resetCheckboxState();
    }
  }, [examinationList]);

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
        entry[examinationsResponse[i].id] = examinationsResponse[i].name;
      }
      listMap[subCategoryId] = entry;
    }
    setExaminationsFetched(true);
    setExaminationList(listMap);
  };

  const updateResults = (examinationsToRun, examinations) => {
    const resultsMap = {};
    console.log('examinationsToRun:', examinationsToRun);

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
              examinationName = examinations[subCategory][examinationId];
            }
          }
        }

        resultsMap[examinationsToRun[i]] = {
          name: examinationName,
          value: stepValues[examinationsToRun[i]].value,
          isNormal: stepValues[examinationsToRun[i]].isNormal,
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

  const resetCheckboxState = () => {
    const initialCheckboxState = {};

    Object.keys(examinationList).forEach((examinationSubcategoryId) => {
      Object.keys(examinationList[examinationSubcategoryId]).forEach((examinationId) => {
        initialCheckboxState[examinationId] = false;
      });
    });

    setCheckboxesChecked(initialCheckboxState);
  };

  const handleCheckboxChange = (examinationId) => {
    setCheckboxesChecked((prev) => ({
      ...prev,
      [examinationId]: !prev[examinationId],
    }));
  };

  return {
    categoryNames,
    subCategoryNames,
    stepValues,
    examinationList,
    examinationsFetched,
    updateResults,
    checkboxesChecked,
    handleCheckboxChange,
  };
};
