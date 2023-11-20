import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  VStack,
  Textarea,
  Checkbox,
  Button,
  Input,
} from '@chakra-ui/react';
import LoadingSkeleton from '../loadingSkeleton';

export default function CreateTreatment(props) {
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

  useEffect(() => {
    const fetchTreatmentTypes = async () => {
      const headers = {
        'Content-type': 'application/json',
      };

      const treatmentTypes = await props.getCallToApi(
        'http://localhost:5173/api/case/getTreatmentTypes',
        headers,
      );
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
    const headers = {
      'Content-type': 'application/json',
      id: id,
    };

    const response = await props.getCallToApi(
      'http://localhost:5173/api/case/getTreatmentSubtypes',
      headers,
    );

    return response;
  };

  const fetchTreatments = async (treatmentSubtypeId) => {
    const headers = {
      'Content-type': 'application/json',
      treatment_subtype_id: treatmentSubtypeId,
    };

    const response = await props.getCallToApi(
      'http://localhost:5173/api/case/getTreatmentList',
      headers,
    );

    return response;
  };

  const setPrompt = (prompt) => {
    setStepData({
      ...stepData,
      prompt: prompt,
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton></LoadingSkeleton>
      ) : (
        <FormControl>
          <FormLabel>Prompt</FormLabel>
          <Textarea placeholder='Prompt' onChange={(e) => setPrompt(e.target.value)}></Textarea>

          <VStack>
            <FormLabel>Stegspecifika behandlingar + dosering</FormLabel>

            {Object.entries(treatmentTypes).map(([id, name]) => (
              <>
                <h2>{name}</h2>

                {treatmentSubtypes[id].map((treatmentSubtype, index) => (
                  <>
                    <Checkbox id={treatmentSubtype.id}>{treatmentSubtype.name}</Checkbox>
                    <Input id={'input' + id} placeholder='dosering'></Input>
                    <Button>Lägg till behandling</Button>
                  </>
                ))}
              </>
            ))}
          </VStack>
        </FormControl>
      )}
    </>
  );
}
