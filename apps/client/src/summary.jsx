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
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
Button } from "@chakra-ui/react";

export default function Summary(props){
    const [stepData, setStep] = useState({});
    const [feedbackToDisplay, setFeedbackToDisplay] = useState();

    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": "b4a5265f-dbe4-4d53-a649-2c85874d65fc"
            }
            
            //hårdkodar detta step-id för tillfället:
    
            const response = await props.getCallToApi('http://localhost:5173/api/case/getSummaryStep', headers);

            setStep({
                id : response[0].id,
                process : response[0].process,
                additional_info : response[0].additional_info,
                additional_links : response[0].additional_links
            });
        }

        fetchStep();
    }, []);

    const { isOpen, onToggle } = useDisclosure();
    return (
        
        <div>   
          
          <VStack align="stretch">
           {/* <Card variant="filled">
                <CardHeader>
                    <Heading size='md'>Process</Heading>
                </CardHeader>

                <CardBody>
                <Button onClick={onToggle} >Feedback</Button>
                <Collapse in={isOpen}>
                    <CardBody>
                        <Text align='left'>test</Text>
                    </CardBody>
                </Collapse>
                    <Text align='left'>{stepData.process}</Text>
                </CardBody>
            </Card>
            */}
            <Card variant="filled" width={''}>
                <CardHeader>
                    <Heading size='md'>Summary</Heading>
                </CardHeader>
                <Accordion allowToggle>
                    <AccordionItem >
                        <AccordionButton>
                            <h2>Process</h2>
                        </AccordionButton>
                        <AccordionPanel >
                            <h2 align="left" key={"process"}>{stepData.process}</h2>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem >
                        <AccordionButton>
                            <h2>Additional Info</h2>
                        </AccordionButton>
                        <AccordionPanel >
                            <h2 align="left" key={"process"}>{stepData.additional_info}</h2>
                        </AccordionPanel>
                    </AccordionItem>
                                
                    <AccordionItem >
                        <AccordionButton>
                            <h2>Additional Links    </h2>
                        </AccordionButton>
                        <AccordionPanel >
                            <h2 align="left" key={"process"}>{stepData.additional_links}</h2>
                        </AccordionPanel>
                    </AccordionItem>
                        
                </Accordion>
            </Card>
            </VStack>
        </div>
    )
}