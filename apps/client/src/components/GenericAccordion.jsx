import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Text,
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
 *            ....
 *            ....
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
                <Text>{accordionItem.heading}</Text>
                <AccordionIcon />
              </HStack>
            </AccordionButton>
          </Heading>
          <AccordionPanel>{accordionItem.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
