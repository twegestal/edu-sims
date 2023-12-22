import { Box, VStack, Flex, HStack, useToast, Heading } from '@chakra-ui/react';
import ModuleCard from './ModuleCard';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCreateCase } from '../hooks/useCreateCase';
import LoadingSkeleton from '../loadingSkeleton';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import CreateCaseModal from './CreateCaseModal.jsx';
import Confirm from '../components/Confirm.jsx';
import CaseDetails from './CaseDetails.jsx';
import { useCases } from '../hooks/useCases.js';
import { useExamination } from '../hooks/useExamination.js';
import { useTreatment } from '../hooks/useTreatment.js';
import { useDiagnosis } from '../hooks/useDiagnosis.js';
import {
  validateDiagnosisModule,
  validateExaminationModule,
  validateSummaryModule,
  validateTreatmentModule,
  validateIntroductionModule,
  validateCaseInProgress,
  errorWithPathToString,
  validateCaseToPublish,
} from 'api';
import { useNavigate } from 'react-router-dom';

export default function CaseBuilder() {
  const [modules, moduleHandlers] = useListState([]);
  const { moduleTypes, getModuleTypes } = useCreateCase();
  const [activeModule, setActiveModule] = useState();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState();
  const [medicalFieldId, setMedicalFieldId] = useState();
  const [caseDetailsData, setCaseDetailsData] = useState();
  const [removedModules, setRemovedModules] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { createCase, updateCase } = useCreateCase();
  const toast = useToast();
  const { caseById, getCaseById, getIntroductionStep, getSummaryStep } = useCases();
  const { getExaminationStep } = useExamination();
  const { getDiagnosisStep } = useDiagnosis();
  const { getTreatmentStep } = useTreatment();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModuleTypes = async () => {
      await getModuleTypes();
    };

    if (!moduleTypes) {
      fetchModuleTypes();
    }

    const caseId = localStorage.getItem('caseId');
    if (caseId) {
      localStorage.removeItem('caseId');
      fetchCaseToEdit(caseId);
    }
  }, []);

  const fetchCaseToEdit = async (caseId) => {
    await getCaseById(caseId);
  };

  useEffect(() => {
    if (caseById.length > 0 && moduleTypes) {
      const caseDetails = caseById[0].medical_case;
      setCaseDetailsData({
        caseName: caseDetails.name,
        medicalFieldId: caseDetails.medical_field_id,
      });
      setMedicalFieldId(caseDetails.medical_field_id);

      if (!modules.length > 0) {
        updateTimeLine();
      }
    }
  }, [caseById, moduleTypes]);

  const updateTimeLine = () => {
    const result = {
      source: {
        droppableId: 'availableModules',
        index: null,
      },
      destination: {
        droppableId: 'sandbox',
        index: null,
      },
    };

    for (let i = 0; i < caseById.length; i++) {
      result.source.index = caseById[i].module_type_identifier;
      result.destination.index = i;
      handleDragEnd(result);
    }

    buildModules();
  };

  const buildModules = async () => {
    for (let i = 0; i < caseById.length; i++) {
      const stepData = await fetchStepData(caseById[i].step_id, caseById[i].module_type_identifier);
      moduleHandlers.setItemProp(i, 'stepData', stepData);
      moduleHandlers.setItemProp(i, 'stepTableId', caseById[i].id);
      moduleHandlers.setItemProp(i, 'moduleTableId', caseById[i].step_id);
    }
  };

  const fetchStepData = async (stepId, moduletypeIdentifier) => {
    switch (moduletypeIdentifier) {
      case 0: {
        return await getIntroductionStep(stepId);
      }
      case 1: {
        return await getExaminationStep(stepId);
      }
      case 2: {
        return await getDiagnosisStep(stepId);
      }
      case 3: {
        return await getTreatmentStep(stepId);
      }
      case 4: {
        return await getSummaryStep(stepId);
      }
    }
  };

  const randomizeUniqueId = () => {
    const tokens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789';
    let randomString = '';
    for (let i = 0; i < 10; i++) {
      const index = Math.floor(Math.random() * tokens.length);
      randomString += tokens.charAt(index);
    }
    return randomString;
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.droppableId === 'sandbox') {
      moduleHandlers.reorder({ from: source.index, to: destination.index });
    } else if (source.droppableId === 'availableModules' && destination.droppableId === 'sandbox') {
      const moduleToAdd = moduleTypes[source.index];
      const uniqueId = `${moduleToAdd.id}-${randomizeUniqueId()}`;
      const newModule = { ...moduleToAdd, uniqueId };
      moduleHandlers.setState((currentModules) => {
        const updatedModules = [...currentModules];
        updatedModules.splice(destination.index, 0, newModule);
        return updatedModules;
      });
    }
  };

  const handleDeleteModule = () => {
    moduleHandlers.setState((currentModules) =>
      currentModules.filter((module) => module.uniqueId !== moduleToDelete),
    );

    const moduleToRemove = modules.find((m) => m.uniqueId === moduleToDelete);
    if (moduleToRemove) {
      setRemovedModules([...removedModules, moduleToRemove]);
    }
    setIsConfirmOpen(false);
  };

  const handleOpenModal = (module) => {
    setActiveModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = (stepData) => {
    const index = modules.findIndex((module) => module.uniqueId === activeModule.uniqueId);
    if (index !== -1) {
      moduleHandlers.setItemProp(index, 'stepData', stepData);
    }
    setIsModalOpen(false);
  };

  const handleOpenConfirm = (moduleId) => {
    setModuleToDelete(moduleId);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setModuleToDelete(null);
    setIsConfirmOpen(false);
  };

  const saveCase = async (caseName) => {
    if (modules.length > 0) {
      const caseObject = {
        name: caseName,
        steps: modules,
        medical_field_id: medicalFieldId,
        creator_user_id: user.id,
      };

      const validationResults = validateCaseToSave(caseObject);
      let successfulValidation = true;
      validationResults.forEach((result) => {
        if (!result.success) {
          successfulValidation = false;
        }
      });
      if (successfulValidation) {
        const response = await createCase(caseObject);
        evaluateResponse(response, caseObject.name);
        return navigate('/manageCases');
      } else {
        for (let i = 0; i < validationResults.length; i++) {
          validationResults[i].errors?.map((error, index) => {
            const titleString = validationResults[i].errors[index].module
              ? `Påträffade följande fel i modulen ${validationResults[i].errors[index].module}`
              : 'Påträffade följande fel';
            toast({
              title: titleString,
              description: errorWithPathToString(error),
              status: 'error',
              duration: '9000',
              isClosable: true,
              position: 'top',
            });
          });
        }
      }
    } else {
      showToast(
        'Kunde inte spara fallet',
        'Minst en modul måste läggas till för att kunna spara ett fall',
        'warning',
      );
    }
  };

  const saveEditedCase = async (caseName) => {
    const caseObject = {
      name: caseName,
      steps: modules,
      medical_field_id: medicalFieldId,
      creator_user_id: user.id,
    };
    const validationResults = validateEditedCase(caseObject);
    let successfulValidation = true;
    validationResults.forEach((result) => {
      if (!result.success) {
        successfulValidation = false;
      }
    });
    if (successfulValidation) {
      console.time('editsave');
      const response = await updateCase(caseObject, caseById[0].case_id, removedModules);
      console.timeEnd('editsave');
      setRemovedModules([]);
      evaluateUpdateResponse(response, caseObject.name);
      return navigate('/manageCases');
    } else {
      for (let i = 0; i < validationResults.length; i++) {
        validationResults[i].errors?.map((error, index) => {
          const titleString = validationResults[i].errors[index].module
            ? `Påträffade följande fel i modulen ${validationResults[i].errors[index].module}`
            : 'Påträffade följande fel';
          toast({
            title: titleString,
            description: errorWithPathToString(error),
            status: 'error',
            duration: '9000',
            isClosable: true,
            position: 'top',
          });
        });
      }
    }
  };

  const evaluateResponse = (response, caseName) => {
    if (response === 201) {
      showToast('Fall sparat', 'Fallet har sparats', 'success');
    } else if (response === 400) {
      showToast('Namnkonflikt', `Fallet ${caseName} finns redan. Välj ett annat namn.`, 'error');
    } else {
      showToast('Fel', 'Någonting gick fel och fallet kunde inte läggas till.', 'error');
    }
  };

  const evaluateUpdateResponse = (response) => {
    if (response === 200) {
      showToast('Fallet uppdaterat', 'Fallet har uppdaterats', 'success');
    } else {
      showToast('Fel', 'Någonting gick fel, fallet har inte uppdaterats', 'error');
    }
  };

  const validateCaseToSave = (caseObject) => {
    const validationResults = [];
    caseObject.steps.forEach((module) => {
      const stepData = module.stepData;
      switch (module.module_type_identifier) {
        case 0: {
          const moduleValidationResult = validateIntroductionModule(stepData);

          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 1: {
          const moduleValidationResult = validateExaminationModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 2: {
          const moduleValidationResult = validateDiagnosisModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 3: {
          const moduleValidationResult = validateTreatmentModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 4: {
          const moduleValidationResult = validateSummaryModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
      }
    });
    validationResults.push(validateCaseInProgress(caseObject));
    return validationResults;
  };

  const validateEditedCase = (caseObject) => {
    const validationResults = [];
    caseObject.steps.forEach((module) => {
      const stepData = module.stepData;
      switch (module.module_type_identifier) {
        case 0: {
          const moduleValidationResult = validateIntroductionModule(stepData);

          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 1: {
          const moduleValidationResult = validateExaminationModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 2: {
          const moduleValidationResult = validateDiagnosisModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 3: {
          const moduleValidationResult = validateTreatmentModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
        case 4: {
          const moduleValidationResult = validateSummaryModule(stepData);
          if (!moduleValidationResult.success) {
            validationResults.push(moduleValidationResult);
          }
          break;
        }
      }
    });
    validationResults.push(validateCaseToPublish(caseObject));
    return validationResults;
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <>
      {!moduleTypes ? (
        <LoadingSkeleton />
      ) : (
        <HStack spacing={4}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Flex h='100vh' w='70vw'>
              <Droppable droppableId='availableModules'>
                {(provided) => (
                  <VStack
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    w='50%'
                    bg='gray.100'
                    p={4}
                    boxShadow='md'
                    spacing={4}
                    align='stretch'
                    overflowY='auto'
                    borderRadius={4}
                    marginRight={'1%'}
                  >
                    <Heading as={'h1'} size={'lg'}>
                      Moduler
                    </Heading>
                    {moduleTypes.map((module, index) => (
                      <Draggable key={module.id} draggableId={module.id} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ModuleCard heading={module.name} />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </VStack>
                )}
              </Droppable>

              <Droppable droppableId='sandbox'>
                {(provided) => (
                  <VStack
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    w='50%'
                    flex='1'
                    bg='gray.100'
                    p={4}
                    spacing={4}
                    align='stretch'
                    overflowY='auto'
                    borderRadius={4}
                    marginLeft={'1%'}
                  >
                    <Heading as={'h1'} size={'lg'}>
                      Tidslinje
                    </Heading>
                    {modules.map((module, index) => (
                      <Draggable key={module.uniqueId} draggableId={module.uniqueId} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ModuleCard
                              heading={module.name}
                              handleAccept={() => handleOpenModal(module)}
                              handleDelete={() => handleOpenConfirm(module.uniqueId)}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Box
                      borderStyle='dashed'
                      borderWidth='2px'
                      borderColor='gray.300'
                      borderRadius='md'
                      p={5}
                      textAlign='center'
                      color='gray.500'
                      fontSize='lg'
                      minHeight='150px'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      {modules.length === 0
                        ? 'Dra kort från moduler till tidslinjen för att skapa ett fall'
                        : 'Du kan dra in fler kort och arrangera om kort i tidslinjen för att skapa ditt fall'}
                    </Box>
                  </VStack>
                )}
              </Droppable>
            </Flex>
          </DragDropContext>

          <CaseDetails
            onSave={saveCase}
            onUpdate={saveEditedCase}
            setMedicalFieldId={setMedicalFieldId}
            caseDetailsData={caseDetailsData}
          />
        </HStack>
      )}
      {activeModule && (
        <CreateCaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          module={activeModule}
          moduleData={activeModule}
          medicalFieldId={medicalFieldId}
        />
      )}
      <Confirm
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        header={'Ta bort modul'}
        body={'Är du säker på att du vill ta bort denna modul?'}
        handleConfirm={handleDeleteModule}
      ></Confirm>
    </>
  );
}
