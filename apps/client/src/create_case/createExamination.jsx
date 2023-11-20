import React, { useEffect, useState } from 'react';
import {
  Card,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  Radio,
  HStack,
  VStack,
  Button,
  Textarea,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';

export default function CreateExamination(props) {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const headers = {
        'Content-type': 'application/json',
        id: '',
      };

      const categories = await props.getCallToApi(
        'http://localhost:5173/api/case/getExaminationTypes',
        headers,
      );
      const categoryMap = {};
      const subCategoryMap = {};

      for (let i = 0; i < categories.length; i++) {
        categoryMap[categories[i].id] = categories[i].name;

        const subcategories = await fetchSubcategories(categories[i].id);

        let array = [];
        for (let j = 0; j < subcategories.length; j++) {
          //subCategoryMap[categories[i].id] = {}
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

  useEffect(() => {
    console.log(examinationCategories);
    console.log(examinationSubcategories);
  }, [examinationCategories, examinationSubcategories]);

  const fetchSubcategories = async (id) => {
    const headers = {
      'Content-type': 'application/json',
      examination_type_id: id,
    };

    const response = await props.getCallToApi(
      'http://localhost:5173/api/case/getExaminationSubtypes',
      headers,
    );
    return response;
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

  return (
    <>
      {loading ? (
        <LoadingSkeleton></LoadingSkeleton>
      ) : (
        <FormControl>
          <FormLabel>Prompt</FormLabel>
          <Textarea placeholder='Prompt' onChange={(e) => setPrompt(e.target.value)}></Textarea>

          <VStack>
            <FormLabel>Utredningar att visa för användaren</FormLabel>
            {Object.entries(examinationCategories).map(([id, name]) => (
              <>
                <Checkbox id={id} alignSelf='start'>
                  {name}
                </Checkbox>

                {examinationSubcategories[id].map((element) => (
                  <Checkbox id={element.id} alignSelf='center'>
                    {element.name}
                  </Checkbox>
                ))}
              </>
            ))}
          </VStack>

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

          <Button onClick={() => props.updateCaseObject(stepData)}>Klar med steget</Button>
        </FormControl>
      )}
    </>
  );
}
