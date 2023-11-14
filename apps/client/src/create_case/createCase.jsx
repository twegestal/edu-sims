import React, { useState, useEffect } from "react";
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
    VStack
} from "@chakra-ui/react"
import CreateIntroduction from './createIntro.jsx';
import CreateExamination from "./createExamination.jsx";
import CreateDiagnosis from "./createDiagnosis.jsx";
import CreateTreatment from "./createTreatment.jsx";

export default function CreateCase(props) {
    const [caseObject, setCaseObject] = useState({
        step : []
    });
    const [module, setModule] = useState('0');

    const updateCaseObject = (updatedState) => {
        //setCaseObject
        
        setCaseObject({
            step : [
                ...caseObject.step,
                updatedState
            ]
        })

    }

    const setCaseName = (caseName) => {
        setCaseObject({
            name : caseName
        })
    }

    const changeModule = (radioGroup) => {
        setModule(radioGroup);

    }

    useEffect(() => {
        console.log(caseObject)
    }, [caseObject])

    return (
        <div>
            <FormControl>
                <VStack padding='5'>
                    <Input placeholder="Case-namn" id='caseNameInput' onChange={setCaseName}></Input>

                    <RadioGroup defaultValue='0' onChange={(e) => changeModule(e)}>
                        <HStack>
                            <Radio value='0'>Introduction</Radio>
                            <Radio value='1'>Examination</Radio>
                            <Radio value='2'>Diagnosis</Radio>
                            <Radio value='3'>Treatment</Radio>
                            <Radio value='4'>Summary</Radio>
                        </HStack>
                    </RadioGroup>

                    <div>
                        {module === '0' &&
                            <CreateIntroduction
                                updateCaseObject={updateCaseObject}
                            ></CreateIntroduction>
                        }

                        {module === '1' &&
                            <CreateExamination
                            getCallToApi = {props.getCallToApi}
                            ></CreateExamination>
                        }

                        {module === '2' &&
                            <CreateDiagnosis>
                                
                            </CreateDiagnosis>
                        }

                        {module === '3' &&
                            <CreateTreatment
                            getCallToApi = {props.getCallToApi}
                            ></CreateTreatment>
                        }

                        {module === '4' &&
                            <p>summary</p>
                        }


                    </div>
                </VStack>

            </FormControl>
        </div>
    )
}