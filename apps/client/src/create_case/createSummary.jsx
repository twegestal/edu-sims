import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    VStack,
    Button,
    Textarea,
    Checkbox,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';

export default function CreateSummary({ updateCaseObject }) {
    const [stepData, setStepData] = useState({
        module_type_identifier: 4,
        process: 'default process',
        additional_info: 'default additional info',
        additional_links: 'default additional links',
    });

    const setProcess = (process) => {
        setStepData({
            ...stepData,
            process: process,
        })
    }

    const setAdditionalInfo = (additionalInfo) => {
        setStepData({
            ...stepData,
            additional_info: additionalInfo,
        })
    }

    const setAdditionalLinks = (additionalLinks) => {
        setStepData({
            ...stepData,
            additional_links: additionalLinks,
        })
    }

    return (
        <>
            <FormControl>
                <FormLabel>Process</FormLabel>
                <Textarea placeholder='Process' onChange={(e) => setProcess(e.target.value)}></Textarea>

                <FormLabel>Additional info</FormLabel>
                <Textarea placeholder='Additional info' onChange={(e) => setAdditionalInfo(e.target.value)}></Textarea>

                <FormLabel>Additional Links</FormLabel>
                <Textarea placeholder='Additional links' onChange={(e) => setAdditionalLinks(e.target.value)}></Textarea>

                <Button onClick={() => updateCaseObject(stepData)}>Klar med steget</Button>
            </FormControl>
        </>
    )
}
