import { Box, VStack, Flex, HStack } from '@chakra-ui/react';
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

export default function CaseBuilder() {
  const [modules, moduleHandlers] = useListState([]);
  const { moduleTypes, getModuleTypes } = useCreateCase();
  const [activeModule, setActiveModule] = useState();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { createCase } = useCreateCase();

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

  const saveCase = (caseName, medicalFieldId) => {
    const caseObject = {
      name: caseName,
      steps: modules,
      medical_field_id: medicalFieldId,
      creator_user_id: user.id,
    };

    createCase(caseObject);
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

          <CaseDetails onSave={saveCase} />
        </HStack>
      )}
      {activeModule && (
        <CreateCaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          module={activeModule}
          moduleData={activeModule}
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
