import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Input,
  Button,
  Select,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useTreatment } from '../../../hooks/useTreatment';

export default function ManageTreatmentSubtypes({ onAdd, update }) {
  const [value, setValue] = useState('');
  const [treatmentType, setTreatmentType] = useState();
  const { treatmentTypes, getTreatmentTypes } = useTreatment();
  const [maincategoryError, setMaincategoryError] = useState();
  const [subcategoryError, setSubcategoryError] = useState();

  const fetchTreatmentTypes = async () => {
    await getTreatmentTypes();
  };
  useEffect(() => {
    fetchTreatmentTypes();
  }, [update]);

  const handleAddTreatmentSubtype = () => {
    if (value && treatmentType) {
      setValue('');
      setTreatmentType('');
      onAdd(value, treatmentType);
    } else {
      if (!value) {
        setSubcategoryError(true);
      }

      if (!treatmentType) {
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
              isInvalid={maincategoryError}
              placeholder='Välj huvudkategori...'
              onChange={(e) => {
                setTreatmentType(e.target.value);
                setMaincategoryError(false);
              }}
            >
              {treatmentTypes &&
                treatmentTypes.map((type) => (
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
        <Button onClick={handleAddTreatmentSubtype}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
