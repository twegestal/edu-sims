import { useState } from "react";
import { useEffect } from "react";
import { 
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    Card,
} from "@chakra-ui/react";

export default function Examination(props) {
    const [loading, setLoading] = useState(true);
    const [stepData, setStep] = useState({});
    const [feedBackToDisplay, setFeedbackToDisplay] = useState();
    

    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": props.stepId
            }
            
            try {
                const response = await props.getCallToApi('http://localhost:5173/api/case/getExaminationStep', headers);

                setStep({
                    id : response[0].id,
                    prompt : response[0].prompt,
                    examination_to_display : response[0].examination_to_display,
                    feedback_correct : response[0].feedback_correct,
                    feedback_incorrect : response[0].feedback_incorrect,
                    max_nbr_tests : response[0].max_nbr_tests
                });

                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
            
        }

        fetchStep();
    }, []);

    useEffect(() => {
        console.log(stepData);

    }, [stepData]);

    return (
        <div>
            <Card variant='filled' padding='5'>
                <Text align='left'>{stepData.prompt}</Text> 
            </Card>
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            Utredningar
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        {loading ? (
                            <p>loading.....</p>
                        ) : (
                            <Accordion allowMultiple>
                            {Object.entries(stepData.examination_to_display).map(([category, examinations], index) => (
                                <AccordionItem key={index}>
                                    <h2>
                                        <AccordionButton>
                                            {category}
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel>
                                        <ul>
                                            {examinations.map((examination, i) => (
                                                <li key={i}>{examination}</li>
                                            ))}
                                        </ul>
                                    </AccordionPanel>
                                </AccordionItem>

                            ))}
                        </Accordion>                            
                        )}
                        
                    </AccordionPanel>
                </AccordionItem>

                
            </Accordion>
        </div>
    )
}