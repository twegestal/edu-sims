import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';

export default function Feedback({ wasCorrect, feedbackToDisplay }) {
  return (
    <Accordion
      allowToggle
      defaultIndex={[0]}
      id='feedback'
      width='95%'
      border={'solid'}
      borderWidth={'3px'}
      borderRadius={'12px'}
      borderColor={'gray.400'}
    >
      <AccordionItem>
        <AccordionButton bg={wasCorrect ? 'success.bg' : 'fail.bg'}>
          <Box as='span' flex='1' textAlign='center'>
            Feedback
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text align='left'>{feedbackToDisplay}</Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
