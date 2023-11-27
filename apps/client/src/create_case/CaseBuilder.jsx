import { Box, VStack, Flex } from '@chakra-ui/react';
import ModuleCard from './ModuleCard';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCreateCase } from '../hooks/useCreateCase';
import LoadingSkeleton from '../loadingSkeleton';
import { useState, useEffect } from 'react';
import IntroductionModal from './IntroductionModal';
import { useAuth } from '../hooks/useAuth.jsx';

//const availableModules = [
//  { id: 'introduction', name: 'Introduktion' },
//  { id: 'examination', name: 'Undersökning' },
//  { id: 'diagnosis', name: 'Diagnos' },
//  { id: 'treatment', name: 'Behandling' },
//  { id: 'summary', name: 'Summering' },
//];

export default function CaseBuilder() {
  const [modules, moduleHandlers] = useListState([]);
  const { moduleTypes, getModuleTypes } = useCreateCase();
  const [activeModule, setActiveModule] = useState();
  const [modalToRender, setModalToRender] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const [caseObject, setCaseObject] = useState({
    name: 'default name',
    steps: [],
    medical_field_id: 'default medical field',
    creator_user_id: user.id,
  });

  useEffect(() => {
    const fetchModuleTypes = async () => {
      await getModuleTypes();
    };
    
    if (!moduleTypes) {
      fetchModuleTypes();
    }
  }, []);

  useEffect(() => {
    console.log(caseObject);
  },[caseObject, modules]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.droppableId === 'sandbox') {
      moduleHandlers.reorder({ from: source.index, to: destination.index });
      setCaseObject({
        ...caseObject,
        steps: modules
      });
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

  const handleDeleteModule = (uniqueId) => {
    moduleHandlers.setState((currentModules) =>
      currentModules.filter((module) => module.uniqueId !== uniqueId),
    );
  };

  const handleOpenModuleModal = (module) => {
    setActiveModule(module);

    const moduleTypeIdentifier = module.module_type_identifier;
    switch (moduleTypeIdentifier) {
      case 0: {
        setIsModalOpen(true);
        setModalToRender(<IntroductionModal
          isOpen = {isModalOpen}
          //onClose = {() => handleCloseModal(module)}
          handleCloseModal = {handleCloseModal}
          module = {module}
        />);
        break;
      }
    }
  };

  const handleCloseModal = (module, stepData) => {
    modules[module]
  }

  return (
    <>
    {!moduleTypes ? (
      <LoadingSkeleton />
    ) : (
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
                        handleAccept={() => handleOpenModuleModal(module)}
                        handleDelete={() => handleDeleteModule(module.uniqueId)}
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
    
    )}
    {modalToRender}
    </>
        
  );
}
