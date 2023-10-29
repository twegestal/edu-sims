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
    Stack,
    Skeleton,
    VStack,
    HStack,
    List,
    ListItem,
    Checkbox,
    Button
} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";

export default function Examination(props) {
    const [loading, setLoading] = useState(true);
    const [stepData, setStep] = useState({});
    const [feedBackToDisplay, setFeedbackToDisplay] = useState();
    const [categoryNames, setCategoryNames] = useState({});
    const [subCategoryNames, setSubCategoryNames] = useState({});
    const [examinations, setExaminations] = useState({});
    const [examinationsFetched, setExaminationsFetched] = useState(false);
    const [stepSpecificValues, setStepSpecificValues] = useState({});
    const [results, setResults] = useState({});
    const [resultsReady, setResultsReady] = useState(false);
    

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

                
                

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
            
        }

        fetchStep();
    }, []);

    useEffect(() => {
        // Fetch and store category names:
        const fetchCategoryNames = async () => {
            const categoryNamesMap = {};

            for (const category of Object.keys(stepData.examination_to_display)) {
                const categoryName = await getCategoryName(category);
                categoryNamesMap[category] = categoryName;
            }

            setCategoryNames(categoryNamesMap);
        };

        const fetchSubCategoryNames = async () => {
            const subCategoryNamesMap = {};

            for (const category of Object.keys(stepData.examination_to_display)) {
                const subCategories = stepData.examination_to_display[category];

                for (const subCategory of subCategories) {
                    const subCategoryName = await getSubCategoryName(subCategory);
                    subCategoryNamesMap[subCategory] = subCategoryName;
                }
            }
            setSubCategoryNames(subCategoryNamesMap);
        }

        const fetchStepValues = async () => {
            const stepValuesMap = {};
            const stepValuesResponse = await getStepValues(props.stepId);

            for (let i = 0; i < stepValuesResponse.length; i++) {
                const newPair = {
                    value : stepValuesResponse[i].value,
                    isNormal : stepValuesResponse[i].is_normal,
                    userHasTested : false
                }
                stepValuesMap[stepValuesResponse[i].examination_id] = newPair;
            }
            setStepSpecificValues(stepValuesMap);
        }

        if (!loading) {
            fetchCategoryNames();
            fetchSubCategoryNames();
            fetchStepValues();
        }
    }, [loading, stepData]);


    //denna loggar bara för debugging, tas bort sedan:
    //useEffect(() => {
    //    console.log(stepData);
    //}, [stepData]);
    
    //useEffect(() => {
    //    if (examinationsFetched) {
    //        console.log(examinations);
    //    }
    //    
    //}, [examinations]);

    useEffect(() => {
        if (!loading) {
            console.log(stepSpecificValues);
        }
    }, [stepSpecificValues])

    useEffect(() => {
        console.log(results);
        setResultsReady(true);
    }, [results])

    useEffect(() => {
        const fetchExaminations = async () => {
            const examinationsMap = {};
            for (const subCategoryId of Object.keys(subCategoryNames)) {
                
                const examinationsResponse = await getExaminations(subCategoryId);

                //const array = [];
                //for (let i = 0; i < examinationsResponse.length; i++) {
                //    array.push({
                //        name : examinationsResponse[i].name,
                //        id : examinationsResponse[i].id
                //    });
                //}
                //examinationsMap[subCategoryId] = array;

                const entry = {};
                for (let i = 0; i < examinationsResponse.length; i++) {
                    const id = examinationsResponse[i].id;
                    const name = examinationsResponse[i].name;
                    
                    
                    entry[id] = name;

                    
                }
                examinationsMap[subCategoryId] = entry;
            }
            setExaminations(examinationsMap);
            setExaminationsFetched(true);
        }

        if (!loading && !examinationsFetched) {
            fetchExaminations();
        }
    }, [subCategoryNames])

    const getExaminations = async (examinationSubTypeId) => {
        const headers = {
            "Content-type" : "application/json",
            "examination_subtype_id" : examinationSubTypeId
        }

        try {
            const response = await props.getCallToApi('http://localhost:5173/api/case/getExaminationList', headers);

            return response;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const getCategoryName = async (categoryId) => {
        const headers = {
            "Content-type" : "application/json",
            "id": categoryId
        }

        try {
            const response = await props.getCallToApi('http://localhost:5173/api/case/getExaminationTypes', headers);

            return response.name;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const getSubCategoryName = async (subCategoryId) => {
        const headers = {
            "Content-type" : "application/json",
            "id": subCategoryId
        }
            
        try {
            const response = await props.getCallToApi('http://localhost:5173/api/case/getExaminationSubtypes', headers);

            return response[0].name;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const getStepValues = async (stepId) => {
        const headers = {
            "Content-type" : "application/json",
            "step_id" : stepId
        }

        try {
            const response = await props.getCallToApi('http://localhost:5173/api/case/getExaminationSpecificValues', headers);
            return response;
        } catch (error) {
            console.error("Error fetching stepValues:", error);
        }
    }

    const runExams = () => {
        const examinationsToRun = [];

        for (const subCategory of Object.keys(examinations)) {
            //for (let i = 0; i < examinations[subCategory].length; i++) {
            //    const checkBox = document.getElementById(examinations[subCategory][i].id);
            //    
            //    if (checkBox.checked) {
            //        examinationsToRun.push(checkBox.id);
            //    }
            //}

            for (const examinationId of Object.keys(examinations[subCategory])) {
                const checkBox = document.getElementById(examinationId);
                
                if (checkBox.checked) {
                    examinationsToRun.push(checkBox.id);
                }
            }
            
        }

        setResultsReady(false);
        const resultsMap = {};

        for (let i = 0; i < examinationsToRun.length; i++) {
            if (stepSpecificValues.hasOwnProperty(examinationsToRun[i])) {
                setStepSpecificValues({
                    ...stepSpecificValues,
                    ...stepSpecificValues[examinationsToRun[i]].userHasTested = true
                })

                let examinationName = '';

                for (const subCategory of Object.keys(examinations)) {
                    for (const examinationId of Object.keys(examinations[subCategory])) {
                        if (examinationId === examinationsToRun[i]) {
                            examinationName = examinations[subCategory][examinationId];
                        }
                    }
                }

                resultsMap[examinationsToRun[i]] = {
                    name : examinationName,
                    value : stepSpecificValues[examinationsToRun[i]].value,
                    isNormal : stepSpecificValues[examinationsToRun[i]].isNormal
                }

            } else {
                let examinationName = '';

                for (const subCategory of Object.keys(examinations)) {
                    for (const examinationId of Object.keys(examinations[subCategory])) {
                        if (examinationId === examinationsToRun[i]) {
                            examinationName = examinations[subCategory][examinationId];
                        }
                    }
                }

                resultsMap[examinationsToRun[i]] = {
                    name : examinationName,
                    value : "Normalvärde",
                    isNormal : true
                }
            }

            
        }

        setResults(resultsMap);
        


    }

    return (
        <div>
            <VStack>
                <Card variant='filled' padding='5'>
                    <Text align='left'>{stepData.prompt}</Text> 
                </Card>
                <Card variant='filled'>
                    <Accordion allowMultiple>
                        <AccordionItem>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    Utredningar
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {loading ? (
                                    <Stack>
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                    </Stack>
                                ) : (
                

                                    <Accordion allowMultiple>
                                    {Object.entries(stepData.examination_to_display).map(([category, subCategories], index) => (
                                        <AccordionItem key={index}>
                                            <h2>
                                                <AccordionButton>
                                                    {categoryNames[category]}
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel>
                                                <Accordion allowMultiple>
                                                    {subCategories.map((subCategory, i) => (
                                                    <AccordionItem key={i}>
                                                            <AccordionButton alignContent='left'>
                                                                {subCategoryNames[subCategory]}
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                            <AccordionPanel>
                                                                <List> 
                                                                {
                                                                    examinationsFetched &&
                                                                    Object.entries(examinations[subCategory]).map(([id, name], index) => (
                                                                        <ListItem key={index}>
                                                                            <Checkbox id={id}>{name}</Checkbox>
                                                                        </ListItem>
                                                                    ))
                                                                }
                                                                </List>
                                                            </AccordionPanel>
                                                    </AccordionItem> 
                                                    ))}
                                                </Accordion>
                                            </AccordionPanel>
                                        </AccordionItem>

                                    ))}
                                </Accordion>                            
                                )}
                                
                            </AccordionPanel>
                        </AccordionItem>

                        
                    </Accordion>
                </Card>

                <Button onClick={runExams}>Kör utredningar</Button>

                <Card variant='filled'>
                    <Accordion>
                        <AccordionItem>
                            <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                                    Resultat
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <List>
                                    {
                                        resultsReady &&
                                        Object.entries(results).map(([id, fields], index) => (
                                            <ListItem key={index}>
                                                <HStack>
                                                    {!fields.isNormal &&
                                                        <WarningIcon />
                                                    }
                                                    <Text>{fields.name} : {fields.value}</Text>
                                                </HStack>
                                                
                                                
                                                
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Card>
            </VStack>
        </div>
    )
}