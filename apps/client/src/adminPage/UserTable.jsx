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
  Select,
  TableCaption,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import ResetPassword from './ResetPassword';
import Confirm from '../components/Confirm';

export default function UserTable() {
  const { user } = useAuth();
  const { allUsers, getAllUsers, clearUserInfo, assingAdminPrivilege, revokeAdminPrivilege, userGroups, getUserGroups } = useUser();
  const [loading, setLoading] = useState(true);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [groupToRender, setGroupToRender] = useState();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers(user.id);
      await getUserGroups();
      setLoading(false);
    };
    fetchData();
  }, []);

  //useEffect(() => { console.log(allUsers) }, [allUsers])

  const handleRemoveUser = async (userToRemove) => {
    setIsConfirmOpen(false);
    const response = await clearUserInfo(userToRemove.id);
    if (response) {
      showToast('Användare borttagen', `${userToRemove.email} har tagits bort`, 'success');
      await getAllUsers(user.id);
    } else {
      showToast(
        'Användare kunde inte tas bort',
        `${userToRemove.email} kunde inte tas bort`,
        'warning',
      );
    }
  };

  const assignAdminRights = async (userToAssing) => {
    const response = await assingAdminPrivilege(userToAssing.id);

    if (response) {
      showToast(
        'Användare uppdaterad',
        `${userToAssing.email} har tilldelats administratörsrättigheter`,
        'success',
      );
      await getAllUsers(user.id);
    } else {
      showToast('Fel', 'Användaren kunde inte tilldelas administratörsrättigheter', 'warning');
    }
  };

  const revokeAdminRights = async (userToRevoke) => {
    const response = await revokeAdminPrivilege(userToRevoke.id);

    if (response) {
      showToast(
        'Användare uppdaterad',
        `${userToRevoke.email} har fråntagits administratörsrättigheter`,
        'success',
      );
      await getAllUsers(user.id);
    } else {
      showToast('Fel', 'Användaren kunde inte fråntas administratörsrättigheter', 'warning');
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

  const mapper = (toMap) => {
    return (
      toMap.map((aUser, index) =>
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
      )
    )
  }
  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <>
      {!loading && (
        <TableContainer maxWidth='90%'>
          <Select
            id='selectField'
            placeholder='Välj användare för användargrupp.'
            onChange={(e) => {
              console.log(e.target.value)
              setGroupToRender(e.target.value)
            }}>
            {userGroups.map((group) =>
              group.is_active !== false && (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
          </Select>
          <Table variant='simple'>
            <TableCaption>
              Aktiva användare i EDU-SIMS.
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Byt lösenord</Th>
                <Th>Ta bort användare</Th>
                <Th>Tilldela/Ta bort administratörs rättigheter</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groupToRender ? mapper(allUsers.filter((user) => user.group_id === groupToRender)) : mapper(allUsers)}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <ResetPassword
        isOpen={isResetPasswordOpen}
        onClose={closeResetPassword}
        email={selectedUser.email}
        userToEditId={selectedUser.id}
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
