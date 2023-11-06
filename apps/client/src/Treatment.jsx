import { useState, useEffect } from "react";
import {
    Box,
    Text,
    Card,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    CardBody,
    Collapse,
    useDisclosure,
    Input,
    List,
    ListIcon,
    ListItem,
    Checkbox,
    IconButton,
    HStack,
    Button,
    VStack,
    Step
} from "@chakra-ui/react";
import {
    CloseIcon,
    SmallAddIcon,
    SmallCloseIcon
} from '@chakra-ui/icons'

export default function Treatment(props) {
    const [stepData, setStep] = useState({});
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [treatmentList, setTreatmentList] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState();
    const [treatmentsFetched, setTreatmentsFetched] = useState(false);
    const [checkedTreatments, setCheckedTreatments] = useState([]);
    const [correctValues, setCorrectValues] = useState([]);
    const [feedbackText, setFeedbackText] = useState();
    const { isOpen, onToggle } = useDisclosure();
    const [feedbackWindow, setFeedbackWindow] = useState();

    useEffect(() => {
        props.setDisplayFeedback(false);
        // Hämta nuvarande treatmentsteg
        const fetchStep = async () => {
            const headers = {
                "Content-type": "application/json",
                "id": props.stepId
            }
            try {
                const response = await props.getCallToApi("/api/case/getTreatmentStep", headers);
                setStep({
                    id: response[0].id,
                    prompt: response[0].prompt,
                    treatments_to_display: response[0].treatments_to_display,
                    feedback_correct: response[0].feedback_correct,
                    feedback_incorrect: response[0].feedback_incorrect
                });
                setLoading(false);
            } catch (error) {
                console.error("Error in fetching treatments", error);
            }
        }
        // hämta step specific values
        const fetchStepValues = async () => {
            const headers = {
                "Content-type": "application/json",
                "id": props.stepId
            }
            try {
                const response = await props.getCallToApi("/api/case/getTreatmentSpecificValues", headers);
                setCorrectValues(response);
                setLoading(false);
            } catch (error) {
                console.error("Error in fetching treatments correct values", error);
            }
        }
        // hämta kategories av treatments
        const fetchTreatmentTypes = async () => {
            const headers = {
                "Content-type": "application/json"
            }
            try {
                const response = await props.getCallToApi("/api/case/getTreatmentTypes", headers);
                setTreatmentTypes(response);
                setTreatmentsFetched(true);
            } catch (error) {
                console.error("Error in fetching treatment types", error);
            }
        }
        fetchStep();
        fetchStepValues();
        fetchTreatmentTypes();
    }, []);

    useEffect(() => {
        const getTreatmentList = async () => {
            const treatmentMap = {};
            for (let i = 0; i < treatmentTypes.length; i++) {
                const response = await fetchTreatmentList(treatmentTypes[i].id);
                treatmentMap[treatmentTypes[i].id] = response;
            }
            setTreatmentList(treatmentMap);
        }
        if (!loading) {
            getTreatmentList();
        }
    }, [treatmentTypes]);
    useEffect(() => {
    }, [treatmentList]);

    // hämta lista av typer av behandlingar.
    const fetchTreatmentList = async (treatmentTypeId) => {
        const headers = {
            "Content-type": "application/json",
            "id": treatmentTypeId
        }
        try {
            const response = await props.getCallToApi("/api/case/getTreatmentList", headers);
            return response;
        } catch (error) {
            console.error("Error in fetching medicine types", error);
        }
    }
    const checkTreatmentBox = (treatmentId, name) => {
        setCheckedTreatments((oldValues) => [
            ...oldValues,
            { treatmentId, name }
        ]);
    }
    const removeAddedTreatment = (id) => {
        const newArr = [];
        for (let index = 0; index < checkedTreatments.length; index++) {
            if (id != checkedTreatments[index].treatmentId) {
                newArr.push(checkedTreatments[index]);
            }
        }
        setCheckedTreatments(newArr);
    }

    useEffect(() => {
        console.log(checkedTreatments)
    }, [checkedTreatments]);

    const checkForId = (id) => {
        let ok = true;
        for (let index = 0; index < checkedTreatments.length; index++) {
            if (checkedTreatments[index].treatmentId == id) {
                ok = false;
            }
        }
        return ok;
    }

    const findTreatment = (searchString, treatmentTypeId) => {
        let filteredList = [];
        if (searchString.length > 0) {
            filteredList = treatmentList[treatmentTypeId].filter(obj => {
                if (checkForId(obj.id)) {
                    return obj.name.toLowerCase().includes(searchString.toLowerCase());
                }
                return;
            })
        }
        setSearchResults(
            filteredList.map((treatmentItem, index) => (
                <ListItem key={index}>
                    <HStack>
                        <Text>
                            {treatmentItem.name}
                        </Text>
                        <IconButton id={treatmentItem.id} margin={0.5} size='xs' colorScheme="teal" icon={<SmallAddIcon/>} onClick={(e) => checkTreatmentBox(e.target.id, treatmentItem.name)}>
                        </IconButton>
                    </HStack>
                </ListItem>
            ))
        )
    }

    const ValuateFeedback = () => {
        let ok = true;
        if (checkedTreatments.length == correctValues.length) {
            for (let index = 0; index < correctValues.length; index++) {
                for (let jindex = 0; jindex < checkedTreatments.length; jindex++) {
                    if (correctValues[index.treatment_Id] == checkedTreatments[jindex].treatmentId) {
                        break;
                    }
                    else {
                        ok = false;
                    }
                }
            }
        }
        else {
            ok = false;
        }
        ok = false;

        
        if (ok) {
            setFeedbackText(stepData.feedback_correct);
            setFeedbackWindow();
        }
        else {
            setFeedbackText(stepData.feedback_incorrect);
            setFeedbackWindow();
        }

        props.setDisplayFeedback(true);
        onToggle();
        console.log();
        //console.log(correctValues[0]);
    }

    useEffect(() => {
        /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
        if (props.displayFeedback && !loading) {
            props.updateFeedback(feedbackText);
        }
    }, [feedbackText]);


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
                    {treatmentTypes.map((treatmentType) => (
                        <AccordionItem key={treatmentType.id}>
                            {
                                treatmentsFetched &&
                                <h2>
                                    <AccordionButton onClick={() => findTreatment("", treatmentType.id)}>
                                        <Box as="span" flex='1' textAlign='left'>
                                            {treatmentType.name}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <List id={treatmentType.id}>
                                            {searchResults}
                                        </List>
                                        <Input id="inputField" onChange={(e) => findTreatment(e.target.value, treatmentType.id)} placeholder="Välj behandling genom att söka" />
                                    </AccordionPanel>
                                </h2>
                            }
                        </AccordionItem>
                    ))
                    }
                    <AccordionItem key={"AddedValues"}>
                        <AccordionButton>Added Treatments<AccordionIcon /></AccordionButton>
                        <AccordionPanel>
                            {checkedTreatments.map((Item) => (
                                <h2>
                                    <VStack alignItems={"left"}>
                                        <HStack>
                                            <Text>
                                                {Item.name}
                                            </Text>
                                            <IconButton key={Item.treatmentId} icon={<SmallCloseIcon />} colorScheme="teal" margin={0.5} onClick={() => removeAddedTreatment(Item.treatmentId)}></IconButton>
                                        </HStack>
                                    </VStack>
                                </h2>
                            ))
                            }
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                {props.displayFeedback ? (
                    <Card variant="filled" margin='0.5%'>
                    <Button onClick={onToggle}>Feedback</Button>
                    <Collapse in={isOpen}>
                        <CardBody>
                            <Text align='left'>{feedbackText}</Text>
                        </CardBody>
                    </Collapse>
                </Card>
                    //{feedbackWindow}
                ) : (<Button colorScheme='teal' margin='0.5%' onClick={() => ValuateFeedback()}>Klar med behandlingar</Button>)}

            </Card>

        </div>
    )
}