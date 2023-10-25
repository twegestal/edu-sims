import { useState } from "react";
import { useEffect } from "react";

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    CardBody,
    Collapse,
    Card,
    Button,
    Heading
} from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";



export default function Diagnosis(props) {

    const [stepData, setStepData] = useState({});
    const [feedbackToDisplay, setFeedbackToDisplay] = useState();
    const { isOpen, onToggle } = useDisclosure();


    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": 'dce351f8-db4e-4e91-a1d2-a5dc12f090c7'
            }
            
            //hårdkodar detta step-id för tillfället:
    
            const response = await props.getCallToApi('http://localhost:5173/api/case/getDiagnosisStep', headers);


            setStepData({
                id : response[0].id,
                prompt : response[0].prompt,
                diagnosis_id : response[0].diagnosis_id,
                feedback_correct : response[0].feedback_correct,
                feedback_incorrect : response[0].feedback_incorrect
            });
        }

        fetchStep();
    }, []);


    useEffect(() => {
        console.log(stepData)
    }, [stepData]);

    return ( 
        <div>
            <h2>Diagnos</h2>

            <Collapse in={isOpen} startingHeight={30} noOfLines={1}>
                {stepData.prompt}
            </Collapse>
            <Button onClick={onToggle}>Visa mer</Button>


            <Accordion allowToggle>

                    <AccordionItem key={prompt}>
                            <AccordionButton>
                                <h2>{stepData.prompt}</h2>
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                            </AccordionPanel>
                    </AccordionItem>

            </Accordion>
        </div>
    )
}