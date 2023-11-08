import { useState } from 'react';
import { useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
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
  const [stepData, setStep] = useState({});
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStep = async () => {
      const headers = {
        'Content-type': 'application/json',
        id: props.stepId,
      };

      const response = await props.getCallToApi('/api/case/getIntroductionStep', headers);

      setStep({
        id: response[0].id,
        description: response[0].description,
        prompt: response[0].prompt,
        feedback_correct: response[0].feedback_correct,
        feedback_incorrect: response[0].feedback_incorrect,
      });

      props.setDescription(response[0].description);
      setLoading(false);
    };

    fetchStep();
  }, []);

  const { isOpen, onToggle } = useDisclosure();

  const handleFeedback = (event) => {
    props.setDisplayFeedback(true);
    onToggle();
    //tillfällig lösning baserat på att vi kollar om det finns fler steg eller inte:
    switch (event.id) {
      case 'yesButton': {
        if (props.caseData.length > 2) {
          setFeedbackToDisplay(stepData.feedback_correct);
        } else {
          //dvs att det bara finns ett introsteg och ett summarysteg
          setFeedbackToDisplay(stepData.feedback_incorrect);
        }
        break;
      }
      case 'noButton': {
        if (props.caseData.length > 2) {
          setFeedbackToDisplay(stepData.feedback_incorrect);
        } else {
          //dvs att det bara finns ett introsteg och ett summarysteg
          setFeedbackToDisplay(stepData.feedback_correct);
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
              <Text align='left'>{stepData.description}</Text>
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
                  <Heading size='md'>{stepData.prompt}</Heading>
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
