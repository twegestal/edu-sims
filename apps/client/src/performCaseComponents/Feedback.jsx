import {
  Button,
  Collapse,
  Card,
  CardBody,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';

export default function Feedback(props) {
  return (
    <Accordion allowToggle defaultIndex={[0]} id='feedback'>
      <AccordionItem>
        <AccordionButton>
          <Box as='span' flex='1' textAlign='center'>
            Feedback
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} bg={props.wasCorrect ? 'success.bg' : 'fail.bg'}>
          <Text align='left'>{props.feedbackToDisplay}</Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
