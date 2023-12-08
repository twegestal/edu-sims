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
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ManageMedicalFields({ onAdd }) {
  const [value, setValue] = useState('');

  const handleAddMedicalField = () => {
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
          Nytt medicinskt område
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {' '}
          <Box>
            <Text mb={4} textAlign='left'>
              {' '}
              Skriv in namnet på ett nytt medicinskt område.
            </Text>
          </Box>
          <Input
            placeholder='Nytt medicinskt område...'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddMedicalField}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
