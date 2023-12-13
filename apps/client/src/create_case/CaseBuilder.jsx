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
import {
  validateDiagnosisModule,
  validateExaminationModule,
  validateSummaryModule,
  validateTreatmentModule,
  validateIntroductionModule,
  validateCaseInProgress,
  errorWithPathToString,
} from 'api';

export default function CaseBuilder() {
  const [modules, moduleHandlers] = useListState([]);
  const { moduleTypes, getModuleTypes } = useCreateCase();
  const [activeModule, setActiveModule] = useState();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState();
  const [medicalFieldId, setMedicalFieldId] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { createCase } = useCreateCase();
  const toast = useToast();

  useEffect(() => {
    const fetchModuleTypes = async () => {
      await getModuleTypes();
    };

    if (!moduleTypes) {
      fetchModuleTypes();
    }
  }, []);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.droppableId === 'sandbox') {
      moduleHandlers.reorder({ from: source.index, to: destination.index });
    } else if (source.droppableId === 'availableModules' && destination.droppableId === 'sandbox') {
      const moduleToAdd = moduleTypes[source.index];
      const uniqueId = `${moduleToAdd.id}-${Date.now()}`;
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
      console.log('response i CB:', response);
      evaluateResponse(response, caseObject.name);
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
  }

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
                  </VStack>
                )}
              </Droppable>
            </Flex>
          </DragDropContext>

          <CaseDetails onSave={saveCase} setMedicalFieldId={setMedicalFieldId} />
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
