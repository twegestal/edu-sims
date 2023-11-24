import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  VStack,
  Textarea,
  Checkbox,
  Button,
  Input,
  Heading,
  Card,
  CardBody,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Text
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';
import { useCreateCase } from '../hooks/useCreateCase';

export default function CreateTreatment({ updateCaseObject }) {
  const [stepData, setStepData] = useState({
    module_type_identifier: 3,
    prompt: 'default',
    treatments_to_display: {},
    feedback_correct: 'default',
    feedback_incorrect: 'default',
    step_specific_treatments: [],
  });
  const [treatmentTypes, setTreatmentTypes] = useState();
  const [treatmentSubtypes, setTreatmentSubtypes] = useState();
  const [treatmentList, setTreatmentList] = useState();
  const [loading, setLoading] = useState(true);

  const { getTreatmentTypes, getTreatmentSubtypes, getTreatmentList } = useCreateCase();


  useEffect(() => {
    const fetchTreatmentTypes = async () => {

      const treatmentTypes = await getTreatmentTypes();

      const treatmentTypeMap = {};
      const treatmentSubtypeMap = {};
      const treatmentListMap = {};

      for (let i = 0; i < treatmentTypes.length; i++) {
        treatmentTypeMap[treatmentTypes[i].id] = treatmentTypes[i].name;

        const treatmentSubtypes = await fetchSubtypes(treatmentTypes[i].id);

        let treatmentSubtypeArray = [];
        for (let j = 0; j < treatmentSubtypes.length; j++) {
          let newEntry = {
            id: treatmentSubtypes[j].id,
            name: treatmentSubtypes[j].name,
          };
          treatmentSubtypeArray.push(newEntry);

          const treatments = await fetchTreatments(treatmentSubtypes[j].id);
          let treatmentsArray = [];
          for (let k = 0; k < treatments.length; k++) {
            let newEntry = {
              id: treatments[k].id,
              name: treatments[k].name,
            };
            treatmentsArray.push(newEntry);
            treatmentListMap[treatmentSubtypes[j].id] = treatmentsArray;
          }
        }
        treatmentSubtypeMap[treatmentTypes[i].id] = treatmentSubtypeArray;
      }

      setTreatmentTypes(treatmentTypeMap);
      setTreatmentSubtypes(treatmentSubtypeMap);
      setTreatmentList(treatmentListMap);

      setLoading(false);
    };

    fetchTreatmentTypes();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log(treatmentList);
    }
  }, [treatmentList]);

  const fetchSubtypes = async (id) => {

    const response = await getTreatmentSubtypes(id);

    return response;
  };

  const fetchTreatments = async (treatmentSubtypeId) => {

    const response = await getTreatmentList(treatmentSubtypeId);

    return response;
  };

  useEffect(() => {
    if (!loading) {
      console.log('treatmentType: ', treatmentTypes);
    console.log('treatmentSubtypes: ' , treatmentSubtypes);
    console.log('treatmentList: ', treatmentList);
    }
    
  },[treatmentList])

  const setPrompt = (prompt) => {
    setStepData({
      ...stepData,
      prompt: prompt,
    });
  };

  const addTreatment = (treatmentId) => {
    const dose = document.getElementById('input' + treatmentId).value;
    let addedTreatments = stepData.step_specific_treatments;
    addedTreatments.push({
      treatment_id: treatmentId,
      value: dose,
    })
    setStepData({
      ...stepData,
      step_specific_treatments: addedTreatments,
    })
  }

  const setFeedbackCorrect = (feedback) => {
    setStepData({
      ...stepData,
      feedback_correct: feedback,
    });
  };

  const setFeedbackIncorrect = (feedback) => {
    setStepData({
      ...stepData,
      feedback_incorrect: feedback,
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VStack>
          <FormControl align='stretch' spacing='10'>
            <FormLabel>Prompt</FormLabel>
            
            <Textarea placeholder='Prompt' onChange={(e) => setPrompt(e.target.value)}></Textarea>
            
            <Accordion allowToggle>  
              <AccordionItem>
                <AccordionButton>
                  <FormLabel>Stegspecifika behandlingar + dosering</FormLabel>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {Object.entries(treatmentTypes).map(([id, name]) => (
                    <>
                      <Heading as='h2' size='lg'>{name}</Heading>
                  
                      {treatmentSubtypes[id].map((treatmentSubtype, index) => (
                        <>
                          <Heading as='h3' size='md'>{treatmentSubtype.name}</Heading>
                          
                          <VStack>
                            {treatmentList[treatmentSubtype.id].map((treatment, index) => (
                              <Card>
                                <CardBody>
                                  <Checkbox id={treatment.id}>{treatment.name}</Checkbox>
                                  <Input id={'input' + treatment.id} placeholder='dosering'></Input>
                                  <Button onClick={() => {addTreatment(treatment.id)}}>Lägg till behandling</Button>
                                </CardBody>
                              </Card>
                            ))}
                          </VStack>
                        </>
                      ))}
                    </>
                  ))}
                </AccordionPanel>       
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <FormLabel>Behandlingar att visa för användaren</FormLabel>
                  <AccordionIcon />

                  <AccordionPanel>
                    <Text>Jag sket i detta så länge eftersom vi inte använder treatments_to_display i treatment.jsx //Viktor</Text>
                  </AccordionPanel>
                </AccordionButton>
              </AccordionItem>         
            </Accordion>

            <FormLabel>Korrekt feedback</FormLabel>
            <Textarea
              placeholder='Korrekt Feedback'
              onChange={(e) => setFeedbackCorrect(e.target.value)}
            ></Textarea>

            <FormLabel>Inkorrekt feedback</FormLabel>
            <Textarea
              placeholder='Inkorrekt feedback'
              onChange={(e) => setFeedbackIncorrect(e.target.value)}
            ></Textarea>

            
            
            <Button onClick={() => updateCaseObject(stepData)}>Klar med steget</Button>
          </FormControl>
        </VStack>
        
      )}
    </>
  );
}
