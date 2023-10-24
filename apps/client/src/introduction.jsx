import { useState } from "react";
import { useEffect } from "react";
import { 
    VStack,
    HStack,
    Card,
    CardHeader,
    Heading,
    Text,
    CardBody,
Button } from "@chakra-ui/react";

export default function Introduction(props) {
    const [stepData, setStep] = useState({});
    //den här ska antagligen göras någon annanstans och skickas in som props men hämtar caset här tills vidare:
    const [caseData, setCase] = useState({});
    const [displayFeedback, setDisplayFeedback] = useState(false);

    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json"
            }
            
            //hårdkodar detta case-id för tillfället:
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
            const queryParams = '9bea0534-b426-423c-bd2e-3594815ba566';

            const response = await props.getCallToApi('http://localhost:5173/api/case/getIntroductionStep?id=' + queryParams, headers);

            setCase({
                
            })
        }

        fetchStep();
    }, []);

    const handleFeedback = (event) => {
        switch (event.id) {
            case 'yesButton' : {
                setDisplayFeedback(true);

                break;
            }
            case 'noButton' : {
                setDisplayFeedback(true);

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
                        <Text>{stepData.description}</Text>
                    </CardBody>
                </Card>

                <Card>
                    {(displayFeedback) ?
                    <Card> 
                    <CardHeader>
                        <Heading>Feedback</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{stepData.feedback_correct}</Text>
                    </CardBody>
                    </Card>

                    :

                    <Card>
                    <CardHeader>
                        <Heading>{stepData.prompt}</Heading>
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
            </VStack>
        </div>
    )
}