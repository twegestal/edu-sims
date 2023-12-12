import {
  Accordion,
  AccordionButton,
  AccordionItem,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Box,
  AccordionIcon,
  AccordionPanel,
  Checkbox,
  Button,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCases } from '../hooks/useCases';

export default function CaseDetails({ onSave }) {
  const [caseName, setCaseName] = useState();

  const { medicalFields, getMedicalFields } = useCases();
  const [medicalFieldId, setMedicalFieldId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();
    };

    fetchData();
  }, []);

  return (
    <VStack
      minH='100vh'
      w='33%'
      bg='gray.100'
      p={4}
      boxShadow='md'
      spacing={4}
      align='stretch'
      borderRadius={4}
      marginRight={'1%'}
    >
      <FormControl>
        <FormLabel>Namn på fallet</FormLabel>
        <Input
          placeholder='Fyll i namnet på fallet'
          onChange={(e) => setCaseName(e.target.value)}
        ></Input>

        
        <FormLabel>Medicinskt område</FormLabel>
        <Select placeholder='Välj ett område' onChange={(e) => setMedicalFieldId(e.target.value)}>
          {medicalFields &&
            medicalFields.map((medicalField) => (
              <option key={medicalField.id} value={medicalField.id}>
                {medicalField.name}
              </option>
            ))}
        </Select>
      </FormControl>

      <Button onClick={() => onSave(caseName, medicalFieldId)}>Spara fallet</Button>
    </VStack>
  );
}
