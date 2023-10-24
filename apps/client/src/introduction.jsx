import { useState } from "react";
import { 
    Flex,
    Spacer,
    Card,
    CardHeader,
    Text,
    CardBody,
Button } from "@chakra-ui/react";

export default function Introduction(props) {
    const [introductionStep, setStep] = useState();


    

    //fetch introduction step data from database:
    //const step = async () => {
    //    await props.getCallToApi('http://localhost:5173/api/case/getIntroductionStep?id=' + queryParams, headers);
    //}

    const fetchStep = async () => {
        const headers = {
            "Content-type" : "application/json"
        }
        
        //hårdkodar detta case-id för tillfället:
        const queryParams = '9bea0534-b426-423c-bd2e-3594815ba566';
        
        const step = await props.getCallToApi('http://localhost:5173/api/case/getIntroductionStep?id=' + queryParams, headers);
        console.log('step: ' + step[0]);
        setStep(step[0]);
        console.log('introductionStep: ' + introductionStep);
    }

    return (
        <div>
            <Flex>
                <Button onClick={fetchStep}>Hämta skiten</Button>
                <Card>
                    <CardBody>
                        <Text id="texten">
                            
                        </Text>
                    </CardBody>
                </Card>
            </Flex>
        </div>
    )
}