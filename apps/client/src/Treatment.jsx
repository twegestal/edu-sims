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
    Input,
    List,
    ListIcon,
    ListItem,
    Checkbox,
    IconButton,
    HStack,
    Button
} from "@chakra-ui/react";
import {
    SmallAddIcon
} from '@chakra-ui/icons'

export default function Treatment(props) {
    const [stepData, setStep] = useState({});
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [treatmentList, setTreatmentList] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState();
    const [treatmentsFetched, setTreatmentsFetched] = useState(false);
    const [checkedTreatments, setCheckedTreatments] = useState([]);

    useEffect(() => {
        // Hämta nuvarande treatmentsteg
        const fetchStep = async () => {
            const headers = {
                "Content-type": "application/json",
                "id": props.stepId
            }
            try {
                const response = await props.getCallToApi("http://localhost:5173/api/case/getTreatmentStep", headers);
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
        // hämta kategories av treatments
        const fetchTreatmentTypes = async () => {
            const headers = {
                "Content-type": "application/json"
            }
            try {
                const response = await props.getCallToApi("http://localhost:5173/api/case/getTreatmentTypes", headers);
                setTreatmentTypes(response);
                setTreatmentsFetched(true);
            } catch (error) {
                console.error("Error in fetching treatment types", error);
            }
        }
        fetchStep();
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
    useEffect(() =>{
        console.log("treatment")
        console.log(treatmentList)
        console.log("list")
    },[treatmentList]);

    // hämta lista av typer av behandlingar.
    const fetchTreatmentList = async (treatmentTypeId) => {
        const headers = {
            "Content-type": "application/json",
            "id": treatmentTypeId
        }
        try {
            const response = await props.getCallToApi("http://localhost:5173/api/case/getTreatmentList", headers);
            return response;
        } catch (error) {
            console.error("Error in fetching medicine types", error);
        }
    }
    const checkTreatmentBox = (treatmentId) => {
        setCheckedTreatments((oldValues) => [
            ...oldValues,
            treatmentId
        ]);
    }
    useEffect(() => {
        console.log(checkedTreatments)
    }, [checkedTreatments]);

    console.log(Checkbox.checked);

    const findTreatment = (searchString, treatmentTypeId) => {
        console.log(treatmentTypeId);
        let filteredList = [];
        if (searchString.length > 0 && !checkTreatmentBox.contains(treatmentTypeId)) {
            filteredList = treatmentList[treatmentTypeId].filter(obj => {
                return obj.name.toLowerCase().includes(searchString.toLowerCase());
            })
        }
        setSearchResults(
            filteredList.map((treatmentItem, index) => (
                <ListItem key={index}>
                    <HStack>
                        <Text>
                            {treatmentItem.name}
                        </Text>
                        <IconButton id={treatmentItem.id} icon={<SmallAddIcon />} onClick={(e) => checkTreatmentBox(e.target.id)}>
                        </IconButton>
                    </HStack>
                </ListItem>
            ))
        )
    }

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
                                        <Input onChange={(e) => findTreatment(e.target.value, treatmentType.id)} placeholder="Välj behandling genom att söka" />
                                    </AccordionPanel>
                                </h2>
                            }
                        </AccordionItem>
                    ))
                    }
                </Accordion>
            </Card>
        </div>
    )
}