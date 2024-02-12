import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ManageTreatmentTypes({ onAdd }) {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState();

  const handleAddTreatmentType = () => {
    if (value) {
      setValue('');
      onAdd(value);
    } else {
      setIsError(true);
    }
  };
  return (
    <Card size={'md'}>
      <CardHeader>
        <Heading as={'h3'} size={'md'}>
          {' '}
          Ny huvudkategori
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Fyll i namnet på ny huvudkategori</FormLabel>
            <Input
              isInvalid={isError}
              placeholder='Ny huvudkategori...'
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setIsError(false);
              }}
            />
            {isError && <FormErrorMessage>Huvudkategori måste fyllas i</FormErrorMessage>}
          </FormControl>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddTreatmentType}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
