import { useState } from 'react';
import { useEffect } from 'react';
import {
  VStack,
  Box,
  Card,
  CardHeader,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import { useCases } from '../../hooks/useCases.js';

export default function Summary(props) {
  const [loading, setLoading] = useState(true);
  const { getSummaryStep, summaryStep } = useCases();

  useEffect(() => {
    const fetchStep = async () => {
      await getSummaryStep(props.stepId);
      setLoading(false);
    };

    fetchStep();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VStack alignItems='stretch'>
          <Card variant='filled'>
            <CardHeader>
              <Heading size='md'>Sammanfattning</Heading>
            </CardHeader>
            <Accordion allowMultiple defaultIndex={[0]}>
              <AccordionItem>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='center'>
                    Process
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <h2 align='left' key={'process'}>
                    {summaryStep.process}
                  </h2>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='center'>
                    Övrig information
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <h2 align='left' key={'process'}>
                    {summaryStep.additional_info}
                  </h2>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='center'>
                    Övriga länkar
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <h2 align='left' key={'process'}>
                    {summaryStep.additional_links}
                  </h2>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Card>
        </VStack>
      )}
    </div>
  );
}
