import { FormControl, FormLabel, Input, VStack, Button, Select, Heading } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCases } from '../hooks/useCases';

export default function CaseDetails({ onSave, setMedicalFieldId, caseDetailsData }) {
  const [caseName, setCaseName] = useState('Fyll i namnet på fallet');

  const { medicalFields, getMedicalFields } = useCases();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (caseDetailsData) {
      setCaseName(caseDetailsData?.caseName || 'Fyll i namnet på fallet');
    }
  }, [caseDetailsData]);

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
      <Heading as={'h1'} size={'lg'}>
        Falldetaljer
      </Heading>
      <FormControl>
        <FormLabel>Namn på fallet</FormLabel>
        <Input
          value={caseName}
          placeholder='Fyll i namnet på fallet'
          onChange={(e) => setCaseName(e.target.value)}
        ></Input>

        <FormLabel>Medicinskt område</FormLabel>
        <Select
          id={'medicalFieldSelect'}
          placeholder='Välj ett område'
          onChange={(e) => setMedicalFieldId(e.target.value)}
          value={caseDetailsData?.medicalFieldId || ''}
        >
          {medicalFields &&
            medicalFields.map((medicalField) => (
              <option key={medicalField.id} value={medicalField.id}>
                {medicalField.name}
              </option>
            ))}
        </Select>
      </FormControl>

      <Button onClick={() => onSave(caseName)}>Spara fallet</Button>
    </VStack>
  );
}
