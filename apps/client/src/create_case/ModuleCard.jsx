import { Card, CardHeader, Heading, CardFooter, Button, Fade } from '@chakra-ui/react';

export default function ModuleCard({ heading, handleAccept, handleDelete }) {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>{heading}</Heading>
      </CardHeader>
      <Fade in={true}>
        <CardFooter justify={'space-between'}>
          {handleAccept && (
            <Button colorScheme={'blue'} onClick={handleAccept}>
              Hantera
            </Button>
          )}
          {handleDelete && (
            <Button colorScheme={'red'} onClick={handleDelete}>
              Ta bort
            </Button>
          )}
        </CardFooter>
      </Fade>
    </Card>
  );
}
