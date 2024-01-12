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
import Confirm from '../components/Confirm';
import LoadingSkeleton from '../loadingSkeleton';
import { useCreateCaseUtils } from '../hooks/createCase/UseCreateUtils';
import ConfirmTreatmentValues from './ConfirmTreatmentValues';

export default function TreatmentModal({ isOpen, onClose, moduleData }) {
  const [loading, setLoading] = useState(true);

  const moduleTypeIdentifier = 3;
  const [prompt, setPrompt] = useState();
  const [treatmentsToDisplay, setTreatmentsToDisplay] = useState({});
  const [feedbackCorrect, setFeedbackCorrect] = useState();
  const [feedbackIncorrect, setFeedbackIncorrect] = useState();
  const [stepSpecificTreatments, setStepSpecificTreatments] = useState([]);
  const [isCheckboxStatesDone, setIsCheckboxStatesDone] = useState(false);

  const [treatmentToConfirm, setTreatmentToConfirm] = useState();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmValuesOpen, setIsConfirmValuesOpen] = useState(false);

  const { treatmentTypes, treatmentSubtypes, treatmentList, fetchTreatmentTypes } =
    useCreateCaseUtils();

  const [checkboxesChecked, setCheckboxesChecked] = useState({}); //belongs to the checkboxes for treatments to display
  const [treatmentCheckboxesChecked, setTreatmentCheckboxesChecked] = useState({}); //belongs to the checkboxes for step specific treatments

  useEffect(() => {
    const callFetchTreatmentTypes = async () => {
      await fetchTreatmentTypes();
      setLoading(false);
    };

    callFetchTreatmentTypes();
  }, []);

  useEffect(() => {
    if (treatmentSubtypes) {
      resetCheckBoxState();
    }

    if (stepSpecificTreatments.length > 0) {
      resetTreatmentCheckboxState();
    }

    setPrompt(moduleData?.stepData?.prompt || '');
    setTreatmentsToDisplay(moduleData?.stepData?.treatments_to_display || {});
    setStepSpecificTreatments(moduleData?.stepData?.step_specific_treatments || []);
    setFeedbackCorrect(moduleData?.stepData?.feedback_correct || '');
    setFeedbackIncorrect(moduleData?.stepData?.feedback_incorrect || '');

    const treatments = moduleData?.stepData?.treatments_to_display;
    if (treatments) {
      Object.keys(treatments).forEach((treatmentTypeId) => {
        treatments[treatmentTypeId].forEach((treatmentSubtypeId) => {
          handleCheckboxChange(treatmentSubtypeId);
        });
      });
    }

    const stepValues = moduleData?.stepData?.step_specific_treatments;
    if (stepValues) {
      stepValues.forEach((element) => {
        handleTreatmentCheckboxChange(element.treatment_id);
      });
    }
  }, [moduleData]);

  useEffect(() => {
    if (isCheckboxStatesDone) {
      const treatments = moduleData?.stepData?.treatments_to_display;
      if (treatments) {
        Object.keys(treatments).forEach((treatmentTypeId) => {
          treatments[treatmentTypeId].forEach((treatmentSubtypeId) => {
            handleCheckboxChange(treatmentSubtypeId);
          });
        });
      }

      const stepValues = moduleData?.stepData?.step_specific_treatments;
      if (stepValues) {
        stepValues.forEach((element) => {
          handleTreatmentCheckboxChange(element.treatment_id);
        });
      }
    }
  }, [isCheckboxStatesDone]);

  useEffect(() => {
    if (!loading) {
      resetCheckBoxState();
      resetTreatmentCheckboxState();
      setIsCheckboxStatesDone(true);
    }
  }, [loading]);

  const resetCheckBoxState = () => {
    const initialCheckboxesState = {};

    Object.keys(treatmentSubtypes).forEach((treatmentId) => {
      Object.keys(treatmentSubtypes[treatmentId]).forEach((treatmentSubtypeId) => {
        initialCheckboxesState[treatmentSubtypeId] = false;
      });
    });

    setCheckboxesChecked(initialCheckboxesState);
  };

  const resetTreatmentCheckboxState = () => {
    const initialCheckboxesState = {};

    stepSpecificTreatments.forEach((element) => {
      initialCheckboxesState[element.treatment_id] = false;
    });

    setTreatmentCheckboxesChecked(initialCheckboxesState);
  };

  const buildStep = () => {
    const stepData = {
      module_type_identifier: moduleTypeIdentifier,
      prompt: prompt,
      treatments_to_display: treatmentsToDisplay,
      feedback_correct: feedbackCorrect,
      feedback_incorrect: feedbackIncorrect,
      step_specific_treatments: stepSpecificTreatments,
    };

    onClose(stepData);
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const clearContent = () => {
    setPrompt('');
    setTreatmentsToDisplay({});
    setStepSpecificTreatments([]);
    setFeedbackCorrect('');
    setFeedbackIncorrect('');

    resetCheckBoxState();
    resetTreatmentCheckboxState();
    setIsConfirmOpen(false);
  };

  const handleCheckboxChange = (subtypeId) => {
    setCheckboxesChecked((prev) => ({
      ...prev,
      [subtypeId]: !prev[subtypeId],
    }));
  };

  const handleTreatmentCheckboxChange = (treatmentId) => {
    setTreatmentCheckboxesChecked((prev) => ({
      ...prev,
      [treatmentId]: !prev[treatmentId],
    }));
  };

  const updateTreatmentTypesToDisplay = (checkBox, treatmentTypeId) => {
    setTreatmentsToDisplay((prevTreatmentsToDisplay) => {
      const newTreatmentsToDisplay = { ...prevTreatmentsToDisplay };

      if (checkBox.checked) {
        newTreatmentsToDisplay[treatmentTypeId] = [
          ...(newTreatmentsToDisplay[treatmentTypeId] || []),
          checkBox.id,
        ];
      } else {
        newTreatmentsToDisplay[treatmentTypeId] = (
          newTreatmentsToDisplay[treatmentTypeId] || []
        ).filter((id) => id !== checkBox.id);

        if (newTreatmentsToDisplay[treatmentTypeId].length === 0) {
          delete newTreatmentsToDisplay[treatmentTypeId];
        }
      }

      return newTreatmentsToDisplay;
    });
  };

  const updateStepSpecificTreatments = (isChecked, treatmentId) => {
    if (isChecked) {
      const newEntry = {
        treatment_id: treatmentId,
      };
      setStepSpecificTreatments([...stepSpecificTreatments, newEntry]);
    } else {
      const newValues = stepSpecificTreatments.filter(
        (value) => value.treatment_id !== treatmentId,
      );
      setStepSpecificTreatments(newValues);
    }
  };

  const handleOpenConfirmValues = (treatmentName, treatmentId) => {
    setTreatmentToConfirm({
      id: treatmentId,
      name: treatmentName,
    });
    setIsConfirmValuesOpen(true);
  };

  const handleCloseConfirmValues = () => {
    setTreatmentToConfirm(null);
    setIsConfirmValuesOpen(false);
  };

  const handleConfirmValues = (treatmentDose) => {
    let mutableStepSpecificTreatments = stepSpecificTreatments;
    mutableStepSpecificTreatments.forEach((element) => {
      if (element.treatment_id === treatmentToConfirm.id) {
        element.value = treatmentDose;
      }
    });

    setTreatmentToConfirm(null);
    setStepSpecificTreatments(mutableStepSpecificTreatments);
    setIsConfirmValuesOpen(false);
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
              <ModalHeader>Behandling</ModalHeader>

              <ModalBody>
                <FormControl isRequired>
                  <FormLabel fontWeight={'bold'}>Uppmaning till studenten</FormLabel>

                  <Textarea
                    value={prompt}
                    placeholder={'Fyll i uppmaning till studenten'}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></Textarea>

                  <FormLabel fontWeight={'bold'}>Behandlingar att visa för studenten</FormLabel>
                  {treatmentTypes &&
                    Object.entries(treatmentTypes).map(([treatmentId, name]) => (
                      <VStack
                        marginBottom={'5px'}
                        key={'div' + treatmentId}
                        alignItems={'flex-start'}
                      >
                        <Heading size='sm' key={treatmentId}>
                          {name}
                        </Heading>

                        {treatmentSubtypes &&
                          Object.entries(treatmentSubtypes[treatmentId]).map(
                            ([subtypeId, subtypeName]) => (
                              <VStack alignItems='flex-start' key={subtypeId}>
                                <Checkbox
                                  key={'checkbox' + subtypeId}
                                  id={subtypeId}
                                  isChecked={checkboxesChecked[subtypeId]}
                                  onChange={(e) => {
                                    handleCheckboxChange(subtypeId);
                                    updateTreatmentTypesToDisplay(e.target, treatmentId);
                                  }}
                                >
                                  {subtypeName}
                                </Checkbox>
                              </VStack>
                            ),
                          )}
                      </VStack>
                    ))}

                  {Object.keys(treatmentsToDisplay).length > 0 && (
                    <FormLabel fontWeight={'bold'}>
                      Bocka i korrekta behandlingar för det här steget
                    </FormLabel>
                  )}
                  {Object.entries(treatmentsToDisplay).map(([treatmentTypeId]) => (
                    <div key={'div' + treatmentTypeId}>
                      <Heading key={treatmentTypeId} as='h3' size='md'>
                        {treatmentTypes[treatmentTypeId]}
                      </Heading>
                      <Accordion allowMultiple key={`accordion-${treatmentTypeId}`}>
                        {treatmentsToDisplay[treatmentTypeId].map((treatmentSubtypeId) => (
                          <div key={'div' + treatmentSubtypeId}>
                            <AccordionItem>
                              <Heading key={treatmentSubtypeId} as='h4' size='sm'>
                                <AccordionButton>
                                  <Box as='span' flex='1' textAlign='left'>
                                    {treatmentSubtypes[treatmentTypeId][treatmentSubtypeId]}
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </Heading>

                              <AccordionPanel>
                                {treatmentList[treatmentSubtypeId]?.length > 0 && (
                                  <VStack
                                    key={`vstack-${treatmentSubtypeId}`}
                                    alignItems='flex-start'
                                  >
                                    {treatmentList[treatmentSubtypeId].map((treatment) => (
                                      <Flex
                                        key={'flex' + treatment.id}
                                        justify='space-between'
                                        align='center'
                                        w='full'
                                      >
                                        <Checkbox
                                          isChecked={treatmentCheckboxesChecked[treatment.id]}
                                          onChange={(e) => {
                                            updateStepSpecificTreatments(
                                              e.target.checked,
                                              treatment.id,
                                            );
                                            handleTreatmentCheckboxChange(treatment.id);
                                          }}
                                        >
                                          {treatment.name}
                                        </Checkbox>
                                        {treatmentCheckboxesChecked[treatment.id] && (
                                          <Button
                                            variant='solid'
                                            size='sm'
                                            onClick={() =>
                                              handleOpenConfirmValues(treatment.name, treatment.id)
                                            }
                                          >
                                            Lägg till dosering
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

                  <FormLabel fontWeight={'bold'}>Feedback för rätt svar</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för rätt svar'
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  ></Textarea>

                  <FormLabel fontWeight={'bold'}>Feedback för fel svar</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för fel svar'
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

          {treatmentToConfirm && (
            <ConfirmTreatmentValues
              isOpen={isConfirmValuesOpen}
              onClose={handleCloseConfirmValues}
              handleConfirm={handleConfirmValues}
              treatmentName={treatmentToConfirm.name}
              treatmentId={treatmentToConfirm.id}
              stepSpecificTreatments={stepSpecificTreatments}
            />
          )}
        </>
      )}
    </>
  );
}
