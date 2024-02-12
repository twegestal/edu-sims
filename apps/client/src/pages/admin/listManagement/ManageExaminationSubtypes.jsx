import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Input,
  Button,
  Box,
  Text,
  Select,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useExamination } from '../../../hooks/useExamination';

export default function ManageExaminationSubtypes({ onAdd, update }) {
  const [value, setValue] = useState('');
  const [examinationType, setExaminationType] = useState();
  const { examinationTypes, getExaminationTypes } = useExamination();
  const [subcategoryError, setSubcategoryError] = useState();
  const [maincategoryError, setMaincategoryError] = useState();

  const fetchExaminationTypes = async () => {
    await getExaminationTypes();
  };
  useEffect(() => {
    fetchExaminationTypes();
  }, [update]);

  const handleAddExaminationType = () => {
    if (value && examinationType) {
      setValue('');
      setExaminationType('');
      onAdd(value, examinationType);
    } else {
      if (!value) {
        setSubcategoryError(true);
      }

      if (!examinationType) {
        setMaincategoryError(true);
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <Heading as={'h3'} size={'md'}>
          {' '}
          Ny underkategori
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={subcategoryError}>
            <FormLabel>Fyll i namnet på ny underkategori</FormLabel>
            <Input
              placeholder='Ny underkategori...'
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSubcategoryError(false);
              }}
            />
            {subcategoryError && <FormErrorMessage>Underkategori måste fyllas i</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={maincategoryError}>
            <FormLabel>Tillhör huvudkategori</FormLabel>
            <Select
              placeholder='Välj huvudkategori...'
              onChange={(e) => {
                setExaminationType(e.target.value);
                setMaincategoryError(false);
              }}
            >
              {examinationTypes &&
                examinationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
            </Select>
            {maincategoryError && <FormErrorMessage>Huvudkategori måste fyllas i</FormErrorMessage>}
          </FormControl>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddExaminationType}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
