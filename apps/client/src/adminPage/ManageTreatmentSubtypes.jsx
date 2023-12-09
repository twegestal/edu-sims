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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useTreatment } from '../hooks/useTreatment';

export default function ManageTreatmentSubtypes({ onAdd, update }) {
  const [value, setValue] = useState('');
  const [treatmentType, setTreatmentType] = useState();
  const { treatmentTypes, getTreatmentTypes } = useTreatment();

  const fetchTreatmentTypes = async () => {
    await getTreatmentTypes();
  };
  useEffect(() => {
    fetchTreatmentTypes();
  }, [update]);

  const handleAddTreatmentSubtype = () => {
    if (value && treatmentType) {
      setValue('');
      onAdd(value, treatmentType);
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
          {' '}
          <Box>
            <Text mb={4} textAlign='left'>
              {' '}
              Skriv in namnet på en ny underkategori.
            </Text>
          </Box>
          <Input
            placeholder='Ny underkategori...'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Select
            placeholder='Välj huvudkategori...'
            onChange={(e) => setTreatmentType(e.target.value)}
          >
            {treatmentTypes &&
              treatmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </Select>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddTreatmentSubtype}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
