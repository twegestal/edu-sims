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

export default function ManageTreatmentTypes({ onAdd }) {
  const [value, setValue] = useState('');
  const { treatmentTypes, getTreatmentTypes } = useTreatment();

  const fetchTreatmentTypes = async () => {
    await getTreatmentTypes();
  };
  useEffect(() => {
    fetchTreatmentTypes();
  }, []);

  const handleAddTreatmentSubtype = () => {
    if (value) {
      setValue('');
      onAdd(value);
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
          <Select placeholder='Välj huvudkategori...'>
            {treatmentTypes &&
              treatmentTypes.map((type) => <option value={type.id}>{type.name}</option>)}
          </Select>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddTreatmentSubtype}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
