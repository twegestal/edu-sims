/*
  This file continans the introduction step component.
  It recieves the specific step data in the variabel stepData.
*/
import { Button, Divider, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import Feedback from './Feedback';
export default function Introduction({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
  updateFaultsArray,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState();
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [disableJaBtn, setDisableJaBtn] = useState(false);
  const [disableNejBtn, setDisableNejBtn] = useState(false);

  const finishStep = (answer, btnPressed) => {
    if (!btnDisabled) {
      updateIsFinishedArray(index);
      incrementActiveStepIndex();
      if (answer !== stepData.continue_treatment) {
        updateFaultsArray(index);
        setIsCorrect(false);
        setFeedbackToDisplay(stepData.feedback_incorrect);
      } else {
        setIsCorrect(true);
        setFeedbackToDisplay(stepData.feedback_correct);
      }
      if (btnPressed === 'yesBtn') {
        setDisableNejBtn(true);
      } else {
        setDisableJaBtn(true);
      }
      setBtnDisabled(true);
      setIsFinished(true);
    }
  };
  return (
    <>
      <VStack spacing='8'>
        <Heading size='md'>Patientmöte</Heading>
        <Text align='left'>{stepData.description}</Text>

        <Divider variant='edu' />

        <Heading size='md'>Finns det anledning att utreda patienten vidare?</Heading>

        <HStack justifyContent='center' spacing='8' width='100%'>
          <Button
            id='yesBtn'
            variant='base'
            width='20%'
            isDisabled={disableJaBtn}
            onClick={() => finishStep(true, 'yesBtn')}
          >
            JA
          </Button>
          <Button
            id='noBtn'
            variant='base'
            width='20%'
            isDisabled={disableNejBtn}
            onClick={() => finishStep(false, 'noBtn')}
          >
            NEJ
          </Button>
        </HStack>
        {isFinished === true && (
          <Feedback wasCorrect={isCorrect} feedbackToDisplay={feedbackToDisplay}></Feedback>
        )}
      </VStack>
    </>
  );
}
