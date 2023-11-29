import {
    Button,
} from '@chakra-ui/react';


export default function DrawerBtn(props) {
    return (
        <>
            <Button w={'100%'} marginBottom={'5%'}>
                {props.text}
            </Button>
        </>
    );
}


