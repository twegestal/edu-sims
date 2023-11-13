import React, {useEffect, useState} from 'react';
import {
    Card,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    RadioGroup,
    Radio,
    HStack,
    Button,
    Textarea
} from "@chakra-ui/react";

export default function CreateIntro(props) {
    const [stepData, setStepData] = useState({
        module_type_identifier : 0,
        description : 'default',
        prompt : 'default',
        feedback_correct : 'default',
        feedback_incorrect : 'default'
    });

    const setDescription = (description) => {
        setStepData({
            ...stepData,
            description : description
        })
    }

    const setPrompt = (prompt) => {
        setStepData({
            ...stepData,
            prompt : prompt
        })
    }

    const setFeedbackCorrect = (feedback) => {
        setStepData({
            ...stepData,
            feedback_correct : feedback
        })
    }

    const setFeedbackIncorrect = (feedback) => {
        setStepData({
            ...stepData,
            feedback_incorrect : feedback
        })
    }
    return (
        <div>
            <FormControl>
                <FormLabel>Beskrivning</FormLabel>

                <Textarea placeholder='Beskrivning' onChange={(e) => setDescription(e.target.value)}></Textarea>

                <FormLabel>Prompt</FormLabel>
                <Textarea placeholder='Prompt' onChange={(e) => setPrompt(e.target.value)}></Textarea>

                <FormLabel>Korrekt feedback</FormLabel>
                <Textarea placeholder='Korrekt Feedback' onChange={(e) => setFeedbackCorrect(e.target.value)}></Textarea>

                <FormLabel>Inkorrekt feedback</FormLabel>
                <Textarea placeholder='Inkorrekt feedback' onChange={(e) => setFeedbackIncorrect(e.target.value)}></Textarea>

                <Button onClick={() => props.updateCaseObject(stepData)}>Klar med steget</Button>
            </FormControl>
        </div>
    )
}