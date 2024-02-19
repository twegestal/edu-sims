
/*
  This file continans the Diagnosis step component.
  It recieves the specific step data in the variabel stepData that is sent from DisplayCase.
*/

import { Button, Box, Card, Divider, Heading, Input, InputGroup, InputRightAddon, Stack, VStack, HStack, Text } from '@chakra-ui/react';
import { Search2Icon, AddIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react';
import Feedback from './Feedback';

export default function Diagnosis({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {

  const [searchTerm, setSearchTerm] = useState('');

  const [isCorrect, setIsCorrect] = useState();
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [isFinished, setIsFinished] = useState(false);
  const [diagnosis, setDiagnosis] = useState();
  const [searchFieldText, setSearchFieldText] = useState("Sök efter Diagnos");

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };

  const filteredList = searchTerm
  ? stepData.diagnosis_list.filter((diagnosis) =>
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  : [];

  const validateChoosenDiagnosis = () => {
    if (diagnosis === stepData.diagnosis_id) {
      setIsCorrect(true);
      setFeedbackToDisplay(stepData.feedback_correct);
    } else {
      setIsCorrect(false);
      setFeedbackToDisplay(stepData.feedback_incorrect);
    }
    finishStep();
  }

  return (
    <>
      <VStack spacing='8'>

        <Heading size={'md'}>{stepData.prompt}</Heading>

        <Divider variant='edu'></Divider>

        <Stack width={'100%'}>
          <InputGroup>
            <Input value={searchFieldText} onClick={() => {if (!isFinished) {setSearchFieldText("")}}} onChange={(e) => 
            {
              if (!isFinished) {
                setSearchTerm(e.target.value)
                setSearchFieldText(e.target.value)
              }
            }} />
            <InputRightAddon >
              <Search2Icon />
            </InputRightAddon>
          </InputGroup>
        </Stack>

        <Stack>
          {filteredList.map((diagnosis) => (
            <Card key={diagnosis.id} padding={'10px'} border='2px' width={'100%'} onClick={() => {
              setDiagnosis(diagnosis.id);
              setSearchFieldText(diagnosis.name);
              setSearchTerm("")
            }}>
              <HStack>
                <AddIcon></AddIcon>
                <Text textAlign={'left'}>{diagnosis.name}</Text>
              </HStack>
            </Card>
          ))}
        </Stack>

        {isFinished === false && (
          <Button onClick={() => validateChoosenDiagnosis()}>Ställ Diagnos</Button>
        )}

        <Divider variant='edu'></Divider>

        {isFinished === true && (
          <Feedback wasCorrect={isCorrect} feedbackToDisplay={feedbackToDisplay}></Feedback>
        )}
      </VStack>
    </>
  );
}
