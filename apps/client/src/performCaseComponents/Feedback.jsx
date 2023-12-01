import {
    Button,
    Collapse,
    Card,
    CardBody,
    Text,
} from '@chakra-ui/react';

export default function Feedback(props) {
    return (
        <Card variant='filled'>
            <Button onClick={props.onToggle} borderRadius={'0'}>Feedback</Button>
            <Collapse in={props.isOpen}>
                <CardBody id='feedback' onClick={props.onToggle} bg={props.wasCorrect ? 'success.bg' : 'fail.bg'}>
                    <Text align='left'>{props.feedbackToDisplay}</Text>
                </CardBody>
            </Collapse>
        </Card>
  );
}
