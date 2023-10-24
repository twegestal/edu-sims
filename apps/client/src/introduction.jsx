import { useState } from "react";
import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { 
    VStack,
    HStack,
    Card,
    CardHeader,
    Heading,
    Text,
    CardBody,
    Collapse,
Button } from "@chakra-ui/react";

export default function Introduction(props) {
    const [stepData, setStep] = useState({});
    //den här ska antagligen göras någon annanstans och skickas in som props men hämtar caset här tills vidare:
    const [caseData, setCase] = useState([]);
    const [displayFeedback, setDisplayFeedback] = useState(false);
    const [feedbackToDisplay, setFeedbackToDisplay] = useState();

    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json"
            }
            
            //hårdkodar detta step-id för tillfället:
            const queryParams = '9bea0534-b426-423c-bd2e-3594815ba566';
    
            const response = await props.getCallToApi('http://localhost:5173/api/case/getIntroductionStep?id=' + queryParams, headers);

            setStep({
                id : response[0].id,
                description : response[0].description,
                prompt : response[0].prompt,
                feedback_correct : response[0].feedback_correct,
                feedback_incorrect : response[0].feedback_incorrect
            });
        }

        const fetchCase = async () => {
            const headers = {
                "Content-type" : "application/json"
            }
            
            //hårdkodar detta case-id för tillfället:
            const queryParams = 'c79e80c2-a164-4f8b-9a56-a3cb4fc85647';

            const response = await props.getCallToApi('http://localhost:5173/api/case/getCaseById?id=' + queryParams, headers);

            setCase(response);
        }
        fetchCase();
        fetchStep();
    }, []);

    const { isOpen, onToggle } = useDisclosure();

    const handleFeedback = (event) => {
        setDisplayFeedback(true);
        onToggle();
        //tillfällig lösning baserat på att vi kollar om det finns fler steg eller inte:
        switch (event.id) {
            case 'yesButton' : {
                if (caseData.length > 2) {
                    setFeedbackToDisplay(stepData.feedback_correct);
                }
                else { //dvs att det bara finns ett introsteg och ett summarysteg
                    setFeedbackToDisplay(stepData.feedback_incorrect)
                }
                break;
            }
            case 'noButton' : {
                if (caseData.length > 2) {
                    setFeedbackToDisplay(stepData.feedback_incorrect);
                }
                else { //dvs att det bara finns ett introsteg och ett summarysteg
                    setFeedbackToDisplay(stepData.feedback_correct)
                }
                break;
            }
        }
    }

    return (
        <div>               
            <VStack>
                <Card>
                    <CardHeader>
                        <Heading size='md'>Patientmöte</Heading>
                    </CardHeader>

                    <CardBody>
                        <Text align='left'>{stepData.description}</Text>
                    </CardBody>
                </Card>

                <Card>
                    {(displayFeedback) ?

                    <Card> 
                    <Button onClick={onToggle}>Feedback</Button>
                    <Collapse in={isOpen}>
                    
                    <CardBody>
                        <Text align='left'>{feedbackToDisplay}</Text>
                    </CardBody>
                    
                    </Collapse>
                    </Card>
                    :
                    

                    <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>{stepData.prompt}</Heading>
                    </CardHeader>

                    <CardBody>
                    <HStack>
                            <Button id="yesButton" onClick={(e) => handleFeedback(e.target)}>JA</Button>
                            <Button id="noButton" onClick={(e) => handleFeedback(e.target)}>NEJ</Button>
                        </HStack>
                    </CardBody>
                    </Card>
                    }
                    
                </Card>

                {displayFeedback &&
                <Button>Gå vidare</Button>
                }
            </VStack>
        </div>
    )
}