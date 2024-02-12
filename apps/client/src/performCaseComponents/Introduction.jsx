import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
export default function Introduction({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
  updateFaultsArray,
}) {
  const [isFinished, setIsFinished] = useState(false);

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
    //TODO: if skiten var fel:
    updateFaultsArray(index);
  };
  return (
    <>
      <VStack align='stretch' spacing='8'>
        {/* <Card variant='filled'>
          <CardHeader>
            <Heading size='md'>Patientmöte</Heading>
          </CardHeader>

          <CardBody>
            <Text align='left'>{stepData.description}</Text>
          </CardBody>
        </Card> */}
        <Heading size='md'>Patientmöte</Heading>
        <Text align='left'>{stepData.description}</Text>

        <Divider />

        <Text align='left'>{stepData.prompt}</Text>
      </VStack>
      {isFinished === false && (
        <Button bg='fail.bg' onClick={finishStep}>
          Gör färdigt steget
        </Button>
      )}
    </>
  );
}
