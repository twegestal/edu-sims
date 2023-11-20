import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  VStack,
  Button,
  Textarea,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';
import { useCreateCase } from '../hooks/useCreateCase';

export default function CreateExamination({ updateCaseObject }) {
  const [stepData, setStepData] = useState({
    module_type_identifer: 1,
    prompt: 'default',
    examination_to_display: {},
    feedback_correct: 'default',
    feedback_incorrect: 'default',
    max_nbr_test: 0,
  });
  const [examinationCategories, setExaminationCategories] = useState();
  const [examinationSubcategories, setExaminationSubcategories] = useState();

  const { getAllExaminationTypes, getAllExaminationSubtypes } = useCreateCase();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const id = '';
      const categories = await getAllExaminationTypes(id);
      const categoryMap = {};
      const subCategoryMap = {};

      for (let i = 0; i < categories.length; i++) {
        categoryMap[categories[i].id] = categories[i].name;

        const subcategories = await fetchSubcategories(categories[i].id);
        let array = [];
        for (let j = 0; j < subcategories.length; j++) {
          let newEntry = {
            id: subcategories[j].id,
            name: subcategories[j].name,
          };
          array.push(newEntry);
        }
        subCategoryMap[categories[i].id] = array;
      }

      setExaminationCategories(categoryMap);
      setExaminationSubcategories(subCategoryMap);

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const fetchSubcategories = async (id) => {
    const response = await getAllExaminationSubtypes(id);
    return response;
  };

  const updateExaminationsTypesToDisplay = (checkbox, examinationTypeId) => {
    if (checkbox.checked) {
      const examinationMap = stepData.examination_to_display;
      if (examinationMap[examinationTypeId] instanceof Array) {
        examinationMap[examinationTypeId] = [...examinationMap[examinationTypeId], checkbox.id];

        setStepData({
          ...stepData,
          examination_to_display: examinationMap,
        });
      } else {
        examinationMap[examinationTypeId] = [checkbox.id];

        setStepData({
          ...stepData,
          examination_to_display: examinationMap,
        });
      }
    } else {
      const examinationMap = stepData.examination_to_display;
      let subTypesArray = examinationMap[examinationTypeId];
      subTypesArray = subTypesArray.filter((id) => id !== checkbox.id);

      examinationMap[examinationTypeId] = subTypesArray;

      if (subTypesArray.length > 0) {
        setStepData({
          ...stepData,
          examination_to_display: examinationMap,
        });
      } else {
        delete examinationMap[examinationTypeId];

        setStepData({
          ...stepData,
          examination_to_display: examinationMap,
        });
      }
    }
  };

  const setPrompt = (prompt) => {
    setStepData({
      ...stepData,
      prompt: prompt,
    });
  };

  const setFeedbackCorrect = (feedback) => {
    setStepData({
      ...stepData,
      feedback_correct: feedback,
    });
  };

  const setFeedbackIncorrect = (feedback) => {
    setStepData({
      ...stepData,
      feedback_incorrect: feedback,
    });
  };

  const setMaxNbrTests = (value) => {
    setStepData({
      ...stepData,
      max_nbr_test: value,
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton></LoadingSkeleton>
      ) : (
        <FormControl>
          <FormLabel>Prompt</FormLabel>
          <Textarea placeholder='Prompt' onChange={(e) => setPrompt(e.target.value)}></Textarea>

          <FormLabel>Utredningar att visa för användaren</FormLabel>
          {Object.entries(examinationCategories).map(([categoryId, name]) => (
            <VStack key={categoryId}>
              <h2 id={categoryId}>{name}</h2>

              {examinationSubcategories[categoryId].map((element) => (
                <Checkbox
                  key={element.id}
                  id={element.id}
                  alignSelf='center'
                  onChange={(e) => updateExaminationsTypesToDisplay(e.target, categoryId)}
                >
                  {element.name}
                </Checkbox>
              ))}
            </VStack>
          ))}

          <FormLabel>Korrekt feedback</FormLabel>
          <Textarea
            placeholder='Korrekt Feedback'
            onChange={(e) => setFeedbackCorrect(e.target.value)}
          ></Textarea>

          <FormLabel>Inkorrekt feedback</FormLabel>
          <Textarea
            placeholder='Inkorrekt feedback'
            onChange={(e) => setFeedbackIncorrect(e.target.value)}
          ></Textarea>

          <FormLabel>Max antal test</FormLabel>
          <NumberInput onChange={(valueAsNumber) => setMaxNbrTests(valueAsNumber)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button onClick={() => updateCaseObject(stepData)}>Klar med steget</Button>
        </FormControl>
      )}
    </>
  );
}
