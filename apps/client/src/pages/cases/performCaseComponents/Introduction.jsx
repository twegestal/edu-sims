import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
  StackDivider
} from '@chakra-ui/react';
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
  const [btnSize, setBtnSize] = useState('20%');
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
        setFeedbackToDisplay(stepData.feedback_incorrect)
      } else {
        setIsCorrect(true);
        setFeedbackToDisplay(stepData.feedback_correct)
      }
      if (btnPressed === "jaBtn") {
        setDisableNejBtn(true);
      }else{
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

        <Divider variant="edu" />

        <Heading size='md'>Finns det anledning att utreda patienten vidare?</Heading>

        <HStack justifyContent="center" spacing='8' width='100%'>
          <Button id='jaBtn' variant="base" width='20%' isDisabled={disableJaBtn} onClick={() => finishStep(true, "jaBtn")} >JA</Button>
          <Button id='nejBtn' variant="base" width='20%' isDisabled={disableNejBtn} onClick={() => finishStep(false, "nejBtn")}>NEJ</Button>
        </HStack>
        {isFinished === true && (
          <Feedback wasCorrect={isCorrect} feedbackToDisplay={feedbackToDisplay}></Feedback>

        )}
      </VStack>

    </>
  );
}
