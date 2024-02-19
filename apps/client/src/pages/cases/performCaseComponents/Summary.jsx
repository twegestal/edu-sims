/*
  This file continans the Summary step component.
  It recieves the specific step data in the variabel stepData that is sent from DisplayCase. 
*/
import { Button, Divider, Heading, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function Summary({
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

  useEffect(() => {
    console.log("HÄR", stepData);
  }, []);
  return (
    <>
      <VStack spacing={8} textAlign={'left'}>
        <Heading size={'md'}> Process</Heading>
        <Text>{stepData.process}</Text>
        <Divider variant={'edu'} />

        <Heading size={'md'}>Additional Info</Heading>
        <Text>{stepData.additional_info}</Text>
        <Divider variant={'edu'} />

        <Heading size={'md'}>Additional links</Heading>
        <Text >{stepData.additional_links}</Text>

        {isFinished === false && <Button onClick={finishStep}>Gör färdigt steget</Button>}
      </VStack>
    </>
  );
}
