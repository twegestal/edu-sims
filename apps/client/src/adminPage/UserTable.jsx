import { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useAlert } from '../hooks/useAlert';
import ResetPassword from './ResetPassword';

export default function UserTable() {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const { allUsers, getAllUsers, clearUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers(user.id);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (id, email) => {
    const response = await clearUserInfo(id);
    console.log(response);

    if (response) {
      setAlert('success', 'Användare borttagen', `${email} har tagits bort`);
      await getAllUsers(user.id);
    } else {
      setAlert('error', 'Användare kunde inte tas bort', `${email} kunde inte tas bort`);
    }
  };

  const openResetPasswordModal = (email) => {
    setSelectedUserEmail(email);
    setIsResetPasswordModalOpen(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  return (
    <>
      {!loading && (
        <TableContainer maxWidth='90%'>
          <Table>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Byt lösenord</Th>
                <Th isNumeric>Ta bort användare</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allUsers.map(
                (aUser, index) =>
                  aUser.email !== 'DeletedUser' && (
                    <Tr key={index}>
                      <Td>{aUser.email}</Td>
                      <Td>
                        <FormControl display={'flex'} flexDirection={'column'}>
                          <Button onClick={() => openResetPasswordModal(aUser.email)}>
                            {' '}
                            Sätt nytt lösenord{' '}
                          </Button>
                        </FormControl>
                      </Td>
                      <Td>
                        <Button onClick={() => handleRemoveUser(aUser.id, aUser.email)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ),
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <ResetPassword
        isOpen={isResetPasswordModalOpen}
        onClose={closeResetPasswordModal}
        email={selectedUserEmail}
      />
    </>
  );
}
