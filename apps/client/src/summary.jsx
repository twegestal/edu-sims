import { useState } from "react";
import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { 
    VStack,
    HStack,
    Box,
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
    Fade, 
    ScaleFade, 
    Slide, 
    SlideFade,
    AccordionIcon,
Button } from "@chakra-ui/react";
import LoadingSkeleton from "./loadingSkeleton.jsx";

export default function Summary(props){
    const [stepData, setStep] = useState({});
    const [feedbackToDisplay, setFeedbackToDisplay] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": props.stepId,
            }
            
            //hårdkodar detta step-id för tillfället:
    
            const response = await props.getCallToApi('/api/case/getSummaryStep', headers);

            setStep({
                id : response[0].id,
                process : response[0].process,
                additional_info : response[0].additional_info,
                additional_links : response[0].additional_links
            });

            setLoading(false);
        }

        fetchStep();
    }, []);

    const { isOpen, onToggle } = useDisclosure();
    
    return (
        
        <div>   
          
          
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
            {loading ? (
                <LoadingSkeleton></LoadingSkeleton>
            ) : (
                <VStack alignItems='stretch'>
                    <Card variant="filled">
                        <CardHeader>
                            <Heading size='md'>Sammanfattning</Heading>
                        </CardHeader>
                        <Accordion allowMultiple defaultIndex={[0]}>
                            <AccordionItem >
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='center'>
                                        Process
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel >
                                    <h2 align="left" key={"process"}>{stepData.process}</h2>
                                </AccordionPanel>   
                            </AccordionItem>

                            <AccordionItem >
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='center'>
                                        Övrig information
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel >
                                    <h2 align="left" key={"process"}>{stepData.additional_info}</h2>
                                </AccordionPanel>
                            </AccordionItem>
                                        
                            <AccordionItem >
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='center'>
                                        Övriga länkar
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel >
                                    <h2 align="left" key={"process"}>{stepData.additional_links}</h2>
                                </AccordionPanel>
                            </AccordionItem>
                                
                        </Accordion>
                    </Card>
                </VStack>
            )}
        </div>
    )
}