import { Box, VStack, Flex } from '@chakra-ui/react';
import ModuleCard from './ModuleCard';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const availableModules = [
  { id: 'introduction', title: 'Introduktion' },
  { id: 'examination', title: 'Undersökning' },
  { id: 'diagnosis', title: 'Diagnos' },
  { id: 'treatment', title: 'Behandling' },
  { id: 'summary', title: 'Summering' },
];

export default function CaseBuilder() {
  const [modules, moduleHandlers] = useListState([]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.droppableId === 'sandbox') {
      moduleHandlers.reorder({ from: source.index, to: destination.index });
    } else if (source.droppableId === 'availableModules' && destination.droppableId === 'sandbox') {
      const moduleToAdd = availableModules[source.index];
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

  const handleOpenModuleModal = () => {
    console.log(modules);
  };

  return (
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
              {availableModules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ModuleCard heading={module.title} />
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
                        heading={module.title}
                        handleAccept={handleOpenModuleModal}
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
  );
}
