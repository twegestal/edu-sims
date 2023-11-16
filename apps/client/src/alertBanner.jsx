import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAlert } from "./hooks/useAlert";

export default function AlertBanner() {
    const {status, message, title, setShowAlert} = useAlert();
    useEffect(() => {
        console.log('mountar denna ens?')
    },[])

    return (
        <Alert status={status}>
            <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>

            <CloseButton onClick={setShowAlert(false)}></CloseButton>
        </Alert>
    )
} 