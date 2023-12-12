import { useState } from 'react';
import { useEffect } from 'react';
import {
  Collapse,
  Button,
  Input,
  Box,
  Text,
  Card,
  CardBody,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import LoadingSkeleton from './loadingSkeleton.jsx';
import { useDiagnosis } from './hooks/useDiagnosis.js';
import Feedback from './performCaseComponents/Feedback.jsx';
import { AddIcon } from '@chakra-ui/icons';

export default function Diagnosis(props) {
  const [diagnosisListHtml, setDiagnosisListHtml] = useState('');
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [loading, setLoading] = useState(true);
  const { isOpen, onToggle } = useDisclosure();

  const { diagnosisStep, getDiagnosisStep, diagnosisList, getDiagnosisList } = useDiagnosis();

  useEffect(() => {
    const fetchStep = async () => {
      await getDiagnosisStep(props.stepId);
    };

    const fetchDiagnosisList = async () => {
      await getDiagnosisList(props.medicalFieldId);
    };
    props.setDisplayFeedback(false);
    fetchStep();
    fetchDiagnosisList();
    setLoading(false);
  }, []);

  const findDiagnosis = async (searchString) => {
    /* Filters the diagnosis list based on the param search string  */
    var filterdList = [];
    if (searchString.length > 0) {
      filterdList = diagnosisList.filter((obj) => {
        return obj.name.toLowerCase().includes(searchString.toLowerCase());
      });
    }

    setDiagnosisListHtml(
      filterdList.map((caseItem) => (
        <Box key={caseItem.id} padding={'10px'}>
          <Button
            className='diagnosis_button'
            key={'set_diagnosis_' + caseItem.id}
            onClick={(e) => handleFeedback(caseItem.id)}
            size={'md'}
            minW={'90%'}
            colorScheme='blue'
            variant={'outline'}
            boxShadow='lg'
            leftIcon={<AddIcon />}
          >
            {caseItem.name}
          </Button>
        </Box>
      )),
    );
  };

  const handleFeedback = (choosenDiagnosId) => {
    if (choosenDiagnosId == diagnosisStep.diagnosis_id) {
      setFeedbackToDisplay(diagnosisStep.feedback_correct);
      props.setCorrectDiagnosis(true);
      props.setWasCorrect(true);
      //props.setFeedback(props.feedback.concat("Diagnossteg: " + diagnosisStep.feedback_correct))
    }

    if (choosenDiagnosId != diagnosisStep.diagnosis_id) {
      setFeedbackToDisplay(diagnosisStep.feedback_incorrect);
      props.setFaultsCounter(props.faultsCounter + 1);
      props.setCorrectDiagnosis(false);
      props.setWasCorrect(false);
      //props.setFeedback(props.feedback.concat("Diagnossteg: " + diagnosisStep.feedback_incorrect))
    }

    props.setDisplayFeedback(true);
    onToggle();
  };

  useEffect(() => {
    /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
    if (props.displayFeedback && !loading) {
      props.updateFeedback(feedbackToDisplay);
    }
  }, [feedbackToDisplay]);

  return (
    <div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VStack alignItems='stretch'>
          <Card variant='filled' padding='5'>
            {diagnosisStep.prompt}
          </Card>
          {props.displayFeedback ? (
            <>
              <Feedback
                onToggle={onToggle}
                wasCorrect={props.wasCorrect}
                isOpen={isOpen}
                feedbackToDisplay={feedbackToDisplay}
              />
            </>
          ) : (
            <Card>
              <Input
                onChange={(e) => findDiagnosis(e.target.value)}
                placeholder='Skriv din diagnos här'
              />
              {diagnosisListHtml}
            </Card>
          )}
        </VStack>
      )}
    </div>
  );
}
