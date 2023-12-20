import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Checkbox,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCreateCase } from '../hooks/useCreateCase';
import LoadingSkeleton from '../loadingSkeleton';
import Confirm from '../components/Confirm';
import ConfirmValues from './ConfirmValues';

export default function ExaminationModal({ isOpen, onClose, moduleData }) {
  const [loading, setLoading] = useState(true);
  const moduleTypeIdentifier = 1;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmValuesOpen, setIsConfirmValuesOpen] = useState(false);
  const [examinationToConfirm, setExaminationToConfirm] = useState();
  const [isCheckboxStatesDone, setIsCheckboxStatesDone] = useState(false);

  const [prompt, setPrompt] = useState();
  const [examinationToDisplay, setExaminationToDisplay] = useState({});
  const [stepSpecificValues, setStepSpecificValues] = useState([]);
  const [feedbackCorrect, setFeedbackCorrect] = useState();
  const [feedbackIncorrect, setFeedbackIncorrect] = useState();
  const [maxNbrTests, setMaxNbrTests] = useState(0);

  const [examinationCategories, setExaminationCategories] = useState();
  const [examinationSubcategories, setExaminationSubcategories] = useState();
  const [examinationList, setExaminationList] = useState();
  const [checkboxesChecked, setCheckboxesChecked] = useState({}); //belongs to the checkboxes for examinations to display
  const [examinationCheckboxesChecked, setExaminationCheckboxesChecked] = useState({}); //belongs to the checkboxes for step specific examinations

  const { getAllExaminationTypes, getAllExaminationSubtypes, getExaminationList } = useCreateCase();

  const clearContent = () => {
    setPrompt('');
    setExaminationToDisplay({});
    setStepSpecificValues([]);
    setFeedbackCorrect('');
    setFeedbackIncorrect('');
    setMaxNbrTests(0);

    resetCheckBoxState();
    resetExaminationCheckboxState();
    setIsConfirmOpen(false);
  };

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
        let subcategoryObject = {};
        for (let j = 0; j < subcategories.length; j++) {
          subcategoryObject[subcategories[j].id] = subcategories[j].name;

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
        subCategoryMap[categories[i].id] = subcategoryObject;
      }

      setExaminationCategories(categoryMap);
      setExaminationSubcategories(subCategoryMap);
      setExaminationList(examinationsMap);

      setLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (examinationSubcategories) {
      resetCheckBoxState();
    }
    if (stepSpecificValues.length > 0) {
      resetExaminationCheckboxState();
    }

    setPrompt(moduleData?.stepData?.prompt || '');
    setExaminationToDisplay(moduleData?.stepData?.examination_to_display || {});
    setStepSpecificValues(moduleData?.stepData?.step_specific_values || []);
    setFeedbackCorrect(moduleData?.stepData?.feedback_correct || '');
    setFeedbackIncorrect(moduleData?.stepData?.feedback_incorrect || '');
    setMaxNbrTests(moduleData?.stepData?.max_nbr_tests || 0);

    const examinations = moduleData?.stepData?.examination_to_display;
    if (examinations) {
      Object.keys(examinations).forEach((categoryId) => {
        examinations[categoryId].forEach((subCategoryId) => {
          handleCheckboxChange(subCategoryId);
        });
      });
    }

    const stepValues = moduleData?.stepData?.step_specific_values;
    if (stepValues) {
      stepValues.forEach((element) => {
        handleExaminationCheckboxChange(element.examination_id);
      });
    }
  }, [moduleData]);

  useEffect(() => {
    if (isCheckboxStatesDone) {
      const examinations = moduleData?.stepData?.examination_to_display;
      if (examinations) {
        Object.keys(examinations).forEach((categoryId) => {
          examinations[categoryId].forEach((subCategoryId) => {
            handleCheckboxChange(subCategoryId);
          });
        });
      }

      const stepValues = moduleData?.stepData?.step_specific_values;
      if (stepValues) {
        stepValues.forEach((element) => {
          handleExaminationCheckboxChange(element.examination_id);
        });
      }
    }
  }, [isCheckboxStatesDone]);

  useEffect(() => {
    if (!loading) {
      resetCheckBoxState();
      resetExaminationCheckboxState();
      setIsCheckboxStatesDone(true);
    }
  }, [loading]);

  const resetCheckBoxState = () => {
    const initialCheckboxesState = {};

    Object.keys(examinationSubcategories).forEach((categoryId) => {
      Object.keys(examinationSubcategories[categoryId]).forEach((subCategoryId) => {
        initialCheckboxesState[subCategoryId] = false;
      });
    });

    setCheckboxesChecked(initialCheckboxesState);
  };

  const resetExaminationCheckboxState = () => {
    const initialCheckboxesState = {};

    stepSpecificValues.forEach((element) => {
      initialCheckboxesState[element.examination_id] = false;
    });

    setExaminationCheckboxesChecked(initialCheckboxesState);
  };

  const fetchSubcategories = async (id) => {
    const response = await getAllExaminationSubtypes(id);
    return response;
  };

  const fetchExaminations = async (examinationSubtypeId) => {
    const response = await getExaminationList(examinationSubtypeId);

    return response;
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleOpenConfirmValues = (examinationName, examinationId) => {
    setExaminationToConfirm({
      id: examinationId,
      name: examinationName,
    });
    setIsConfirmValuesOpen(true);
  };

  const handleCloseConfirmValues = () => {
    setExaminationToConfirm(null);
    setIsConfirmValuesOpen(false);
  };

  const handleConfirmValues = (examinationValue, isNormal) => {
    let mutableStepSpecificValues = stepSpecificValues;
    mutableStepSpecificValues.forEach((element) => {
      if (element.examination_id === examinationToConfirm.id) {
        element.value = examinationValue;
        element.is_normal = isNormal;
      }
    });

    setExaminationToConfirm(null);
    setStepSpecificValues(mutableStepSpecificValues);
    setIsConfirmValuesOpen(false);
  };

  const buildStep = () => {
    const stepData = {
      module_type_identifier: moduleTypeIdentifier,
      prompt: prompt,
      examination_to_display: examinationToDisplay,
      step_specific_values: stepSpecificValues,
      feedback_correct: feedbackCorrect,
      feedback_incorrect: feedbackIncorrect,
      max_nbr_tests: maxNbrTests,
    };

    onClose(stepData);
  };

  const updateExaminationTypesToDisplay = (checkBox, examinationTypeId) => {
    setExaminationToDisplay((prevExaminationToDisplay) => {
      const newExaminationToDisplay = { ...prevExaminationToDisplay };

      if (checkBox.checked) {
        newExaminationToDisplay[examinationTypeId] = [
          ...(newExaminationToDisplay[examinationTypeId] || []),
          checkBox.id,
        ];
      } else {
        newExaminationToDisplay[examinationTypeId] = (
          newExaminationToDisplay[examinationTypeId] || []
        ).filter((id) => id !== checkBox.id);

        if (newExaminationToDisplay[examinationTypeId].length === 0) {
          delete newExaminationToDisplay[examinationTypeId];
        }
      }

      return newExaminationToDisplay;
    });
  };

  const updateStepSpecificValues = (isChecked, examinationId) => {
    if (isChecked) {
      const newEntry = {
        examination_id: examinationId,
      };
      setStepSpecificValues([...stepSpecificValues, newEntry]);
    } else {
      const newValues = stepSpecificValues.filter(
        (value) => value.examination_id !== examinationId,
      );
      setStepSpecificValues(newValues);
    }
  };

  const handleCheckboxChange = (subCategoryId) => {
    setCheckboxesChecked((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
  };

  const handleExaminationCheckboxChange = (examinationId) => {
    setExaminationCheckboxesChecked((prev) => ({
      ...prev,
      [examinationId]: !prev[examinationId],
    }));
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Modal isOpen={isOpen} onClose={buildStep}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Utredning</ModalHeader>

              <ModalBody>
                <FormControl>
                  <FormLabel>Uppmaning</FormLabel>
                  <Textarea
                    placeholder='Fyll i din uppmaning till användaren'
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></Textarea>

                  <FormLabel>Utredningar att visa för användare</FormLabel>
                  {Object.entries(examinationCategories).map(([categoryId, name]) => (
                    <div key={'div' + categoryId}>
                      <Heading as='h3' size='sm' key={categoryId}>
                        {name}
                      </Heading>

                      {Object.entries(examinationSubcategories[categoryId]).map(
                        ([subcategoryId, subcategoryName]) => (
                          <VStack alignItems='flex-start' key={subcategoryId}>
                            <Checkbox
                              key={'checkbox' + subcategoryId}
                              id={subcategoryId}
                              isChecked={checkboxesChecked[subcategoryId]}
                              onChange={(e) => {
                                handleCheckboxChange(subcategoryId);
                                updateExaminationTypesToDisplay(e.target, categoryId);
                              }}
                            >
                              {subcategoryName}
                            </Checkbox>
                          </VStack>
                        ),
                      )}
                    </div>
                  ))}

                  <FormLabel>Bocka i korrekta undersökningar för det här steget</FormLabel>
                  {Object.entries(examinationToDisplay).map(([categoryId], index) => (
                    <div key={'div' + categoryId}>
                      <Heading key={categoryId} as='h3' size='md'>
                        {examinationCategories[categoryId]}
                      </Heading>
                      <Accordion allowMultiple key={`accordion-${categoryId}`}>
                        {examinationToDisplay[categoryId].map((subCategoryId) => (
                          <div key={'div' + subCategoryId}>
                            <AccordionItem>
                              <Heading key={subCategoryId} as='h4' size='sm'>
                                <AccordionButton>
                                  <Box as='span' flex='1' textAlign='left'>
                                    {examinationSubcategories[categoryId][subCategoryId]}
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </Heading>

                              <AccordionPanel>
                                {examinationList[subCategoryId]?.length > 0 && (
                                  <VStack key={`vstack-${Date.now()}`} alignItems='flex-start'>
                                    {examinationList[subCategoryId].map((examination) => (
                                      <Flex
                                        key={'flex' + examination.id}
                                        justify='space-between'
                                        align='center'
                                        w='full'
                                      >
                                        <Checkbox
                                          isChecked={examinationCheckboxesChecked[examination.id]}
                                          onChange={(e) => {
                                            updateStepSpecificValues(
                                              e.target.checked,
                                              examination.id,
                                            );
                                            handleExaminationCheckboxChange(examination.id);
                                          }}
                                        >
                                          {examination.name}
                                        </Checkbox>
                                        {examinationCheckboxesChecked[examination.id] && (
                                          <Button
                                            variant='solid'
                                            size='sm'
                                            onClick={() =>
                                              handleOpenConfirmValues(
                                                examination.name,
                                                examination.id,
                                              )
                                            }
                                          >
                                            Lägg till värden
                                          </Button>
                                        )}
                                      </Flex>
                                    ))}
                                  </VStack>
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          </div>
                        ))}
                      </Accordion>
                    </div>
                  ))}

                  <FormLabel>Max antal test</FormLabel>
                  <NumberInput
                    value={maxNbrTests}
                    onChange={(valueAsNumber) => setMaxNbrTests(parseInt(valueAsNumber, 10))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <FormLabel>Korrekt feedback</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för korrekt svar'
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  ></Textarea>

                  <FormLabel>Inkorrekt feedback</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för inkorrekt svar'
                    value={feedbackIncorrect}
                    onChange={(e) => setFeedbackIncorrect(e.target.value)}
                  ></Textarea>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={buildStep}>Spara ändringar</Button>

                <Button onClick={handleOpenConfirm} colorScheme='red' ml={3}>
                  Rensa
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Confirm
            isOpen={isConfirmOpen}
            onClose={handleCloseConfirm}
            header={'Rensa information'}
            body={'Är du säker på att du vill rensa informationen?'}
            handleConfirm={clearContent}
          />

          {examinationToConfirm && (
            <ConfirmValues
              isOpen={isConfirmValuesOpen}
              onClose={handleCloseConfirmValues}
              handleConfirm={handleConfirmValues}
              examinationName={examinationToConfirm.name}
              examinationId={examinationToConfirm.id}
              stepSpecificValues={stepSpecificValues}
            />
          )}
        </>
      )}
    </>
  );
}
