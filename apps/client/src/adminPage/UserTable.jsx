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
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useAlert } from '../hooks/useAlert';
import ResetPassword from './ResetPassword';
import Confirm from '../components/Confirm';

export default function UserTable() {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const { allUsers, getAllUsers, clearUserInfo, assingAdminPrivilege, revokeAdminPrivilege } =
    useUser();
  const [loading, setLoading] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers(user.id);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (userToRemove) => {
    setIsConfirmOpen(false);
    const response = await clearUserInfo(userToRemove.id);
    if (response) {
      setAlert('success', 'Användare borttagen', `${userToRemove.email} har tagits bort`);
      await getAllUsers(user.id);
    } else {
      setAlert(
        'error',
        'Användare kunde inte tas bort',
        `${userToRemove.email} kunde inte tas bort`,
      );
    }
  };

  const assignAdminRights = async (userToAssing) => {
    const response = await assingAdminPrivilege(userToAssing.id);

    if (response) {
      setAlert(
        'success',
        'Användaren',
        `${userToAssing.email} har tilldelats administratörsrättigheter`,
      );
      await getAllUsers(user.id);
    } else {
      setAlert('error', 'Användaren kunde inte tilldelas administratörsrättigheter ');
    }
  };

  const revokeAdminRights = async (userToRevoke) => {
    const response = await revokeAdminPrivilege(userToRevoke.id);

    if (response) {
      setAlert(
        'success',
        'Användarem',
        `${userToRevoke.email} har fråntagits administratörsrättigheter`,
      );
      await getAllUsers(user.id);
    } else {
      setAlert('error', 'Användaren kunde inte fråntas administratörsrättigheter ');
    }
  };

  const openResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const closeResetPassword = () => {
    setIsResetPasswordOpen(false);
  };

  const openConfirm = (user) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
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
                <Th isNumeric>Tilldela/Ta bort administratörs rättigheter</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allUsers.map(
                (aUser, index) =>
                  aUser.email !== 'DeletedUser' &&
                  aUser.id !== user.id && (
                    <Tr key={index}>
                      <Td>{aUser.email}</Td>
                      <Td>
                        <FormControl display={'flex'} flexDirection={'column'}>
                          <Button
                            onClick={() => openResetPassword({ id: aUser.id, email: aUser.email })}
                          >
                            {' '}
                            Sätt nytt lösenord{' '}
                          </Button>
                        </FormControl>
                      </Td>
                      <Td>
                        <Button onClick={() => openConfirm({ id: aUser.id, email: aUser.email })}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                      <Td>
                        {aUser.is_admin ? (
                          <Button onClick={() => revokeAdminRights(aUser)}>
                            {' '}
                            Ta bort adminrättigheter{' '}
                          </Button>
                        ) : (
                          <Button onClick={() => assignAdminRights(aUser)}>
                            {' '}
                            Tilldela adminrättigheter{' '}
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ),
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <ResetPassword
        isOpen={isResetPasswordOpen}
        onClose={closeResetPassword}
        email={selectedUser.email}
      />
      <Confirm
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        header={'Ta bort användare'}
        body={`Är du säker att du vill ta bort användare ${selectedUser.email}`}
        handleConfirm={() => handleRemoveUser(selectedUser)}
      />
    </>
  );
}
