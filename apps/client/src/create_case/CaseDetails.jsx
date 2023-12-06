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
  //const [checkboxChecked, setCheckboxChecked] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();
    };

    fetchData();
  }, []);

  /* const handleCheckboxChange = (checkBoxId) => {
    setCheckboxChecked(checkboxChecked === checkBoxId ? null : checkBoxId);
  }; */

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

        {/* <Accordion>
          <AccordionItem>
            <Heading as='h3' size='md'>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  Medicinskt område
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
                {medicalFields && 
                    medicalFields.map((medicalField) => (
                        <Checkbox isChecked={medicalField.id === checkboxChecked} key={medicalField.id} onChange={() => handleCheckboxChange(medicalField.id)}>{medicalField.name}</Checkbox>
                    ))
                }
            </AccordionPanel>
          </AccordionItem>
        </Accordion> */}
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
