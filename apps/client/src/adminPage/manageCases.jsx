import { Button, Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ShowAllCases from '../showCases/show_all_cases';

export default function AdminOverview() {
  return (
    <>
      <Heading size={'md'}>Hantera fall</Heading>
      <Flex justifyContent={'flex-end'}>
        <Link to={'/caseBuilder'}>
          <Button marginBottom={'20px'} marginRight={'20px'}>
            Skapa nytt fall
          </Button>
        </Link>
      </Flex>
      <ShowAllCases />
    </>
  );
}
