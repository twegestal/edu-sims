import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Input,
  TableContainer,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';

import {
    DeleteIcon
} from '@chakra-ui/icons'


export default function ManageUsers(props) {

    const [allUsers, setAllUsers] = useState([]);


    useEffect(() => {

        const getAllUsers = async () => {
            //Skall ersättas med API kall

            const apiData = [
                {
                    'id': '1',
                    'email': 'test@gmail.com',
                },
                {
                    'id': '2',
                    'email': 'annan@gmail.com',
                },
                {
                    'id': '3',
                    'email': 'fler@gmail.com',
                },
                {
                    'id': '4',
                    'email': 'entill@gmail.com',
                },
                {
                    'id': '5',
                    'email': 'ochentill@gmail.com',
                },
            ]

            setAllUsers(apiData)
        };

        getAllUsers()

    }, []);


  function removeCase(userId) {

    if(confirm('Är du säker på att du vill ta bort användaren?')){
      console.log("Ta bort" + userId)
      //API kall
    }

  }

  return (
    <div>
        <h2>Hantera användare</h2>

        <TableContainer maxWidth='90%'>
        <Table variant='striped' colorScheme='teal'>
            <Thead>
            <Tr>
                <Th>Email</Th>
                <Th>Byt lösenord</Th>
                <Th isNumeric>Ta bort användare</Th>
            </Tr>
            </Thead>
            <Tbody>
            {allUsers.map((user, index) => (
                <Tr key={index}>
                    <Td>{user.email}</Td>
                    <Td>
                        <FormControl display={'flex'} flexDirection={'column'}>
                            <Input type='email' />
                            <Button> Sätt nytt lösenord </Button>
                        </FormControl>
                    </Td>
                    <Td><Button onClick={(e) => removeCase(user.id)}><DeleteIcon /></Button></Td>
                </Tr>
            ))}
            </Tbody>
        </Table>
        </TableContainer>

</div>
  );

}