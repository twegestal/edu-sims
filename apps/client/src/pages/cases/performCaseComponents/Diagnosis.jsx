/*
  This file continans the Diagnosis step component.
  It recieves the specific step data in the variabel stepData that is sent from DisplayCase.
*/

import {
  Button,
  Box,
  Card,
  Divider,
  Heading,
  Stack,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import Feedback from './Feedback';
import SearchBar from '../../../components/SearchBar';

export default function Diagnosis({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [diagnosisName, setDiagnosisName] = useState();
  const [isCorrect, setIsCorrect] = useState();
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [isFinished, setIsFinished] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState("");
  const [choosenDiagnosisCard, setchoosenDiagnosisCard] = useState();
  const [filteredList, setFilteredList] = useState([]);

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };

  const search = (searchTerm) => {
    if (searchTerm) {
      setFilteredList((prevState) => {
        const newState = stepData.diagnosis_list.filter((diagnosis) =>
          diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return newState;
      });
    } else {
      setFilteredList([]);
    }

  };

  const getChoosenDiagnosisCard = () => {
    return (
      <Stack spacing={3}>
        <Heading size={'sm'}>Vald Diagnos</Heading>,
        <HStack>
          <Box
            border='1px solid'
            borderRadius='5'
            paddingTop='1%'
            paddingBottom='1%'
            paddingRight='2%'
            paddingLeft='2%'
            bg='brand.bg'
            width='87%'
          >
            <Text textAlign='left'>{diagnosisName}</Text>
          </Box>

          {isFinished === false && (
            <Box
              border='1px solid'
              borderRadius='5'
              padding='1%'
              paddingLeft='2%'
              paddingRight='2%'
              bg='fail.bg'
              onClick={() => { setDiagnosisId(); setchoosenDiagnosisCard(); }}
            >
              <DeleteIcon />
            </Box>
          )}

        </HStack>
      </Stack>)
  }

  const validateChoosenDiagnosis = () => {
    if (diagnosisId === stepData.diagnosis_id) {
      setIsCorrect(true);
      setFeedbackToDisplay(stepData.feedback_correct);
    } else {
      setIsCorrect(false);
      setFeedbackToDisplay(stepData.feedback_incorrect);
    }
    finishStep();
  };

  return (
    <>
      <VStack spacing='8'>
        <Text size={'md'}>{stepData.prompt}</Text>

        <Divider variant='edu'></Divider>
        {!diagnosisId ? (
          <Stack width={'100%'}>
            <SearchBar onSearch={search} />

            {filteredList.map((diagnosis) => (
              <Card
                key={diagnosis.id}
                padding={'10px'}
                spacing={-1}
                border='2px'
                width={'100%'}
                onClick={() => {
                  setDiagnosisId(diagnosis.id);
                  setFilteredList([]);
                  setDiagnosisName(diagnosis.name);
                }}
              >
                <HStack>
                  <AddIcon></AddIcon>
                  <Text textAlign={'left'}>{diagnosis.name}</Text>
                </HStack>
              </Card>
            ))}

          </Stack>) : (
          <Stack width={'100%'}>
            {
              getChoosenDiagnosisCard()
            }
          </Stack>)}


        {isFinished === true ? (
          <Divider variant='edu'></Divider>,
          <Feedback wasCorrect={isCorrect} feedbackToDisplay={feedbackToDisplay}></Feedback>
        ) : (
          <Button onClick={() => validateChoosenDiagnosis()} isDisabled={!diagnosisId}>Ställ Diagnos</Button>
        )}
      </VStack>
    </>
  );
}
