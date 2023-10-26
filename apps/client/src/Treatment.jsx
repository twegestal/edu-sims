import { useState, useEffect } from "react";
import {
    Box,
    Text,
    Card,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel
 } from "@chakra-ui/react";

export default function Treatment(props){
    const [stepData, setStep] = useState({});
    const [treatmentTypes, setTreatmentTypes] = useState([]);

    useEffect(() => {

        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id" : props.stepId
            }
            try {
                const response = await props.getCallToApi("http://localhost:5173/api/case/getTreatmentStep", headers);
                setStep({
                    id : response[0].id,
                    prompt : response[0].prompt,
                    treatments_to_display : response[0].treatments_to_display,
                    feedback_correct : response[0].feedback_correct,
                    feedback_incorrect : response[0].feedback_incorrect
                });
            } catch(error){
                console.error("Error in fetching treatments", error);
            }
        }
        const fetchTreatmentTypes = async () => {
            const headers = {
                "Content-type" : "application/json",
            }
            try {
                const response = await props.getCallToApi("http://localhost:5173/api/case/getTreatmentTypes");
                setTreatmentTypes(response)
            } catch (error) {
                console.error("Error in fetching treatment types", error);
            }
        }
        fetchStep();
        fetchTreatmentTypes();
    }, []);

    useEffect(() => {
        console.log(treatmentTypes);
    }, [treatmentTypes])

    return (
        <div>
            <Card variant='filled' padding='5'>
                <Text allign='left'>
                    {
                        stepData.prompt
                    }
                </Text>
            </Card>
            <Card>
                <Accordion>
                    { treatmentTypes.map((treatmentType) => (
                            <AccordionItem key={treatmentType.id}>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            {treatmentType.name}
                                        </Box>
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        TBC
                                    </AccordionPanel>
                                </h2>
                            </AccordionItem>

                        )) // THIS IS WHERE I WANT ACCORDION STUFF
                    }
                </Accordion>
            </Card> 
        </div> 
    )
}