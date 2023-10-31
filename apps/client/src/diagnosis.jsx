import { useState } from "react";
import { useEffect } from "react";
import {
    Collapse,
    Button,
    Heading,
    Input,
    Box,
    Text,
    Flex,
    Card
} from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";



export default function Diagnosis(props) {

    const [stepData, setStepData] = useState({});
    const [diagnosisList, setDiagnosisList] = useState([])
    const [diagnosisListHtml, setDiagnosisListHtml] = useState("")
    const [feedbackToDisplay, setFeedbackToDisplay] = useState();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchStep = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": 'dce351f8-db4e-4e91-a1d2-a5dc12f090c7'            //hårdkodar detta step-id för tillfället:
            }
            
    
            const response = await props.getCallToApi('http://localhost:5173/api/case/getDiagnosisStep', headers);


            setStepData({
                id : response[0].id,
                prompt : response[0].prompt,
                diagnosis_id : response[0].diagnosis_id,
                feedback_correct : response[0].feedback_correct,
                feedback_incorrect : response[0].feedback_incorrect
            });
        }

        const fetchDiagnosisList = async () => {
            const headers = {
                "Content-type" : "application/json",
                "id": '6ff9e368-1e44-46d1-8192-ac3069c34f20'            //hårdkodar detta medical_field_id för tillfället:
            }
            
    
            const response = await props.getCallToApi('http://localhost:5173/api/case/getDiagnosisList', headers);
            setDiagnosisList(response)
        }

        props.setDisplayFeedback(false);

        fetchStep();
        fetchDiagnosisList();
        setLoading(false);
    }, []);

    const findDiagnosis = async(searchString) => {
        /* Filters the diagnosis list based on the param search string  */
        var filterdList = []
        if(searchString.length > 0){
            filterdList = diagnosisList.filter(obj => {
            return obj.name.toLowerCase().includes(searchString.toLowerCase());
            })
        }
  
        setDiagnosisListHtml(
            filterdList.map((caseItem) => (
                <Box key={caseItem.id} borderWidth='2px'>
                    <p key={'p_' + caseItem.id}>{caseItem.name}</p>
                    <Button className="diagnosis_button" key={'set_diagnosis_' + caseItem.id} onClick={(e) => handleFeedback(caseItem.id)}>Ställ diagnos</Button>
                </Box>
            ))
        )

    }
    

    const handleFeedback = (choosenDiagnosId) => {
        props.setDisplayFeedback(true);
        console.log('Knappen fungerar')

        if(choosenDiagnosId == stepData.diagnosis_id){
            setFeedbackToDisplay(stepData.feedback_correct);
            //props.setFeedback(props.feedback.concat("Diagnossteg: " + stepData.feedback_correct))
        }

        if(choosenDiagnosId != stepData.diagnosis_id){
            setFeedbackToDisplay(stepData.feedback_incorrect);
            //props.setFeedback(props.feedback.concat("Diagnossteg: " + stepData.feedback_incorrect))
        }
    }

    useEffect(() => {
        /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
        if (props.displayFeedback && !loading) {
            props.updateFeedback(feedbackToDisplay);
        }
    }, [feedbackToDisplay]);



    return ( 
        <div>
            <h2>Diagnos</h2>

            <Card>
                {stepData.prompt}
            </Card>

            <Input onChange={(e) => findDiagnosis(e.target.value)} placeholder='Skriv din diagnos här'/>
            {diagnosisListHtml}
            {feedbackToDisplay}
        </div>
    )
}