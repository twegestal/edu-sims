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
  AccordionIcon
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';
import { useCreateCase } from '../hooks/useCreateCase';

export default function CreateTreatment({ updateCaseObject }) {
  const [stepData, setStepData] = useState({
    module_type_identifer: 3,
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
      treatmentId: treatmentId,
      value: dose,
    })
    setStepData({
      ...stepData,
      step_specific_treatments: addedTreatments,
    })
  }

  useEffect(() =>  {
    console.log('stepData:', stepData)
  }, [stepData])

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
                </AccordionButton>
              </AccordionItem>         
            </Accordion>
            
            <Button onClick={() => updateCaseObject(stepData)}>Klar med steget</Button>
          </FormControl>
        </VStack>
        
      )}
    </>
  );
}
