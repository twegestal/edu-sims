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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Card,
  CardBody,
  Text,
  Input
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';
import { useCreateCase } from '../hooks/useCreateCase';

export default function CreateExamination({ updateCaseObject }) {
  const [stepData, setStepData] = useState({
    module_type_identifier: 1,
    prompt: 'default',
    examination_to_display: {},
    step_specific_values: [],
    feedback_correct: 'default',
    feedback_incorrect: 'default',
    max_nbr_test: 0,
  });
  const [examinationCategories, setExaminationCategories] = useState();
  const [examinationSubcategories, setExaminationSubcategories] = useState();
  const [examinationList, setExaminationList] = useState();

  const { getAllExaminationTypes, getAllExaminationSubtypes, getExaminationList } = useCreateCase();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const id = '';
      const categories = await getAllExaminationTypes(id);
      const categoryMap = {};
      const subCategoryMap = {};
      const examinationsMap = {};

      for (let i = 0; i < categories.length; i++) {
        categoryMap[categories[i].id] = categories[i].name;

        const subcategories = await fetchSubcategories(categories[i].id);
        let subcategoryArray = [];
        for (let j = 0; j < subcategories.length; j++) {
          let newEntry = {
            id: subcategories[j].id,
            name: subcategories[j].name,
          };
          subcategoryArray.push(newEntry);

          const examinations = await fetchExaminations(subcategories[j].id);
          let examinationsArray = [];
          for (let k = 0; k < examinations.length; k++) {
            let newEntry = {
              id: examinations[k].id,
              name: examinations[k].name,
            };
            examinationsArray.push(newEntry);
            examinationsMap[subcategories[j].id] = examinationsArray;
          }
        }
        subCategoryMap[categories[i].id] = subcategoryArray;
      }
      
      setExaminationCategories(categoryMap);
      setExaminationSubcategories(subCategoryMap);
      setExaminationList(examinationsMap);

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const fetchSubcategories = async (id) => {
    const response = await getAllExaminationSubtypes(id);
    return response;
  };

  const fetchExaminations = async (examinationSubtypeId) => {
    const response = await getExaminationList(examinationSubtypeId);

    return response;
  }

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

  const addExamination = (examinationId) => {
    const value = document.getElementById('input' + examinationId).value;
    const isNormal = document.getElementById('checkbox' + examinationId).checked;
    let addedExaminations = stepData.step_specific_values;
    addedExaminations.push({
      examination_id: examinationId,
      value: value,
      is_normal: isNormal,
    });

    
  }

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

            <Accordion allowToggle>  
              <AccordionItem>
                <AccordionButton>
                  <FormLabel>Stegspecifika utredningar + värden</FormLabel>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {Object.entries(examinationCategories).map(([categoryId, name]) => (
                    <>
                      <Heading as='h2' size='lg'>{name}</Heading>
                  
                      {examinationSubcategories[categoryId].map((subcategory, index) => (
                        <>
                          <Heading as='h3' size='md'>{subcategory.name}</Heading>
                          
                          {examinationList[subcategory.id]?.length > 0 ? (
          <VStack>
            {examinationList[subcategory.id].map((examination) => (
              <Card>
                <CardBody>
                  <Text id={examination.id}>{examination.name}</Text>
                  <Input id={'input' + examination.id} placeholder='Värde'></Input>
                  <Checkbox id={'checkbox' + examination.id}>Normalvärde</Checkbox>
                  <Button onClick={() => {addExamination(examination.id)}}>Lägg till utredning + värde</Button>
                </CardBody>
              </Card>
            ))}
          </VStack>
        ) : (
          <Text>No examinations available for this subcategory.</Text>
        )}



                          {/* <VStack>
                            {examinationList[subcategory.id].map((examination, index) => (
                              <Card>
                                <CardBody>
                                  <Text id={examination.id}>{examination.name}</Text>
                                  <Input id={'input' + examination.id} placeholder='Värde'></Input>
                                  <Checkbox id={'checkbox' + examination.id}>Normalvärde</Checkbox>
                                  <Button onClick={() => {addExamination(examination.id)}}>Lägg till utredning + värde</Button>
                                </CardBody>
                              </Card>
                            ))}
                          </VStack> */}
                        </>
                      ))}
                    </>
                  ))}
                </AccordionPanel>       
              </AccordionItem>

                       
                            </Accordion>

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
