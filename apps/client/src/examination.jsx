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
    Skeleton
} from "@chakra-ui/react";

export default function Examination(props) {
    const [loading, setLoading] = useState(true);
    const [stepData, setStep] = useState({});
    const [feedBackToDisplay, setFeedbackToDisplay] = useState();
    const [categoryNames, setCategoryNames] = useState({});
    const [subCategoryNames, setSubCategoryNames] = useState({});
    

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
        // Fetch and store category names
        const fetchCategoryNames = async () => {
            const categoryNamesMap = {};

            for (const category of Object.keys(stepData.examination_to_display)) {
                const categoryName = await getCategoryName(category);
                categoryNamesMap[category] = categoryName;
            }

            setCategoryNames(categoryNamesMap);
        };

        if (!loading) {
            fetchCategoryNames();
        }
    }, [loading, stepData]);

    useEffect(() => {
        //fetch and store subcategory names:
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

        if (!loading) {
            fetchSubCategoryNames();
        }
    }, [loading, stepData]);

    //denna loggar bara för debugging, tas bort sedan:
    useEffect(() => {
        console.log(stepData);
    }, [stepData]);

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

            
            return response.name;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

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
                                            {categoryNames[category]} {/* THIS IS WHERE I WOULD LIKE TO GET THE ACTUAL CATEGORY NAME */}
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel>
                                        <Accordion allowMultiple>
                                            {subCategories.map((subCategory, i) => (
                                               <AccordionItem key={i}>
                                                    <AccordionButton>
                                                        {subCategoryNames[subCategory]}
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel>
                                                        <Text>Här ska det vara massa grejor</Text>
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
        </div>
    )
}