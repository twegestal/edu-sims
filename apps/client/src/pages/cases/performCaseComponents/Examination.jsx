import { Button, VStack, Text, Divider, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import Accordion from '../../../components/GenericAccordion';
import GenericAccordion from '../../../components/GenericAccordion';

export default function Examination({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };

  const setUpAccordions = () => {
    return (
      <GenericAccordion
        allowMultiple={true}
        variant={'edu_exam_type'}
        accordionItems={Object.entries(stepData.examination_to_display).map(([type, subTypes]) => ({
          heading: type,
          content: 'innehåll',
        }))}
      />
    );
  };
  return (
    <>
      <VStack spacing='8'>
        <Text align='left'>{stepData.prompt}</Text>

        <Divider variant='edu' />

        <Heading size='sm'>Välj utredningar från listan:</Heading>
        {setUpAccordions()}
      </VStack>
      {/* <p>Utredningsgrejer</p>
      {isFinished === false && <Button onClick={finishStep}>Gör färdigt steget</Button>} */}
    </>
  );
}
