import { useState } from 'react';
import { useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useCases } from './hooks/useCases.js';
import {
  VStack,
  HStack,
  Card,
  CardHeader,
  Heading,
  Text,
  CardBody,
  Collapse,
  Button,
} from '@chakra-ui/react';
import LoadingSkeleton from './loadingSkeleton.jsx';

export default function Introduction(props) {
  //const [stepData, setStep] = useState({});
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [loading, setLoading] = useState(true);
  const { isOpen, onToggle } = useDisclosure();
  const { getIntroductionStep, introductionStep } = useCases();

  useEffect(() => {
    const fetchStep = async () => {
      await getIntroductionStep(props.stepId);
      setLoading(false);
    };
    fetchStep();
  }, []);

  useEffect(() => {
    if (!loading) {
      props.setDescription(introductionStep.description);
    }
  }, [introductionStep]);

  const handleFeedback = (event) => {
    props.setDisplayFeedback(true);
    onToggle();
    //tillfällig lösning baserat på att vi kollar om det finns fler steg eller inte:
    switch (event.id) {
      case 'yesButton': {
        if (props.caseData.length > 2) {
          setFeedbackToDisplay(introductionStep.feedback_correct);
        } else {
          //dvs att det bara finns ett introsteg och ett summarysteg
          setFeedbackToDisplay(introductionStep.feedback_incorrect);
        }
        break;
      }
      case 'noButton': {
        if (props.caseData.length > 2) {
          setFeedbackToDisplay(introductionStep.feedback_incorrect);
        } else {
          //dvs att det bara finns ett introsteg och ett summarysteg
          setFeedbackToDisplay(introductionStep.feedback_correct);
        }
        break;
      }
    }
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
        <VStack align='stretch'>
          <Card variant='filled'>
            <CardHeader>
              <Heading size='md'>Patientmöte</Heading>
            </CardHeader>

            <CardBody>
              <Text align='left'>{introductionStep.description}</Text>
            </CardBody>
          </Card>

          <Card variant='filled'>
            {props.displayFeedback ? (
              <Card variant='filled'>
                <Button onClick={onToggle}>Feedback</Button>
                <Collapse in={isOpen}>
                  <CardBody>
                    <Text align='left'>{feedbackToDisplay}</Text>
                  </CardBody>
                </Collapse>
              </Card>
            ) : (
              <Card align='center' variant='filled'>
                <CardHeader>
                  <Heading size='md'>{introductionStep.prompt}</Heading>
                </CardHeader>

                <CardBody>
                  <HStack>
                    <Button
                      id='yesButton'
                      colorScheme='teal'
                      onClick={(e) => handleFeedback(e.target)}
                    >
                      JA
                    </Button>
                    <Button
                      id='noButton'
                      colorScheme='teal'
                      onClick={(e) => handleFeedback(e.target)}
                    >
                      NEJ
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            )}
          </Card>
        </VStack>
      )}
    </div>
  );
}
