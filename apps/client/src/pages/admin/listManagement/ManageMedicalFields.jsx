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

export default function ManageMedicalFields({ onAdd }) {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);

  const handleAddMedicalField = () => {
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
          Nytt medicinskt område
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Lägg till ett nytt medicinskt område</FormLabel>
            <Input
              isInvalid={isError}
              placeholder='Nytt medicinskt område...'
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setIsError(false);
              }}
            />
            {isError && <FormErrorMessage>Medicinskt område måste fyllas i</FormErrorMessage>}
          </FormControl>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddMedicalField}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
