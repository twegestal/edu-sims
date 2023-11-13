import React, { useEffect, useState } from 'react';
import {
    Card,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    RadioGroup,
    Radio,
    HStack,
    Button,
    Textarea,
    VStack,
    Select,
    IconButton
} from "@chakra-ui/react";
import {
    CloseIcon,
    SmallAddIcon,
    SmallCloseIcon
} from '@chakra-ui/icons'

export default function CreateDiagnosis(props) {
    const [stepData, setStepData] = useState({
        module_type_identifier: 2,
        prompt: 'default',
        diagnosis: 'default',
        feedback_correct: 'default',
        feedback_incorrect: 'default'
    });
    const [findDiagnosis, setFindDiagnosis] = useState([]);
    const [resultDiagnosis, setResultDiagnosis] = useState([]);
    const [diagnosisHtml, setDiagnosisHtml] = useState("");

    const setPrompt = (prompt) => {
        setStepData({
            ...stepData,
            prompt: prompt
        })
    }

    const setDiagnosis = (diagnosis) => {
        setStepData({
            ...stepData,
            diagnosis: diagnosis
        })
    }
    const setFeedbackCorrect = (feedback) => {
        setStepData({
            ...stepData,
            feedback_correct: feedback
        })
    }

    const setFeedbackIncorrect = (feedback) => {
        setStepData({
            ...stepData,
            feedback_incorrect: feedback
        })
    }

    useEffect(() => {
        const arr = ["s1", "s2", "s3", "s4"]
        setResultDiagnosis(arr);
    }, [])

    useEffect(() => {
        console.log(stepData);
    }, [stepData])

    const filterDiagnosis = (searchString) => {
        var filterdList = []
        if (searchString.length > 0) {
            filterdList = resultDiagnosis.filter(obj => {
                return obj.toLowerCase().includes(searchString.toLowerCase());
            })
        }
        console.log(filterdList);
        setDiagnosisHtml(
            filterdList.map((item) => (
                <Card key={item}>
                    <div onClick={() => setDiagnosis(item)}>
                        <HStack>
                            <Text>{item}</Text>
                            <IconButton id={item} margin={0.5} size='md' colorScheme="teal" icon={<SmallAddIcon />} />
                        </HStack>
                    </div>
                </Card>
            ))
        );

    }

    return (
        <div>
            <FormControl>

                <FormLabel>Uppmaning till användaren</FormLabel>
                <Textarea placeholder='Ange uppmaning till användaren här' onChange={(e) => setPrompt(e.target.value)}></Textarea>
                <Card>
                    <FormLabel>Ange korrekt diagnos</FormLabel>
                    <Input id='inputField' placeholder='Sök korrekt diagnos här' onChange={(e) => filterDiagnosis(e.target.value)} />
                    {diagnosisHtml}
                </Card>
                <FormLabel>Korrekt feedback</FormLabel>
                <Textarea placeholder='Korrekt Feedback' onChange={(e) => setFeedbackCorrect(e.target.value)}></Textarea>

                <FormLabel>Inkorrekt feedback</FormLabel>
                <Textarea placeholder='Inkorrekt feedback' onChange={(e) => setFeedbackIncorrect(e.target.value)}></Textarea>

                <Button margin={'5'} onClick={() => props.updateCaseObject(stepData)}>Klar med steget</Button>
            </FormControl>

        </div>
    )
}