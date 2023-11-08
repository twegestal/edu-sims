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
        module_type_identifier : 2,
        prompt : 'default',
        diagnosis : 'default',
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

    const setDiagnosis = (feedback) => {
        setStepData({
            ...stepData,
            feedback_correct : feedback
        })
    }

    

    return (
        <div>
            
        </div>
    )
}