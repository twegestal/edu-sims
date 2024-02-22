import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Text,
  Box,
  HStack,
} from '@chakra-ui/react';

/**
 * Generic component for accordion elements in the project.
 * The required properties are:
 * allowMultiple - a boolean that controls wether or not the accordion should allow multiple items
 *                 to be open at the same time.
 * variant - a string with the custom variant to be used. choose on of the following:
 *           edu_exam_type
 *           edu_exam_subtype
 *           edu_treatment_type
 *           edu_treatment_subtype
 *           edu_feedback_correct
 *           edu_feedback_incorrect
 * accordionItems - an array of JSON-objects with the following structure:
 *                  [
 *                    { heading: the title that should go in the AccordionButton
 *                      content: the content that should go in the AccordionPanel
 *                    },
 *                  ]
 */

export default function GenericAccordion({ allowMultiple, variant, accordionItems }) {
  return (
    <Accordion variant={variant} allowMultiple={allowMultiple} width='100%'>
      {accordionItems.map((accordionItem, index) => (
        <AccordionItem key={index}>
          <Heading size='md'>
            <AccordionButton>
              <HStack width='100%' justifyContent='space-between'>
                <Box
                  flex='1'
                  textAlign={
                    variant === 'edu_feedback_correct' || variant === 'edu_feedback_incorrect'
                      ? 'center'
                      : 'left'
                  }
                >
                  {accordionItem.heading}
                </Box>
                <AccordionIcon />
              </HStack>
            </AccordionButton>
          </Heading>
          <AccordionPanel textAlign='left'>{accordionItem.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
