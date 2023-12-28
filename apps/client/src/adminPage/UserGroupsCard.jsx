import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  IconButton,
  TableCaption,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser';
import LoadingSkeleton from '../loadingSkeleton';
import Confirm from '../components/Confirm';

export default function UserGroupsCard({ reloading, onGroupRemoved }) {
  const { userGroups, getUserGroups, deactivateUserGroup } = useUser();
  const [loading, setLoading] = useState(true);
  const [buttonsLoadingState, setButtonsLoadingState] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [groupToRemove, setGroupToRemove] = useState();
  const toast = useToast();

  const fetchUserGroups = async () => {
    await getUserGroups();
    setLoading(false);
  };
  useEffect(() => {
    fetchUserGroups();
  }, []);

  useEffect(() => {
    fetchUserGroups();
  }, [reloading]);

  useEffect(() => {
    if (loading == false) {
      const initialState = {};
      userGroups.forEach((userGroup) => {
        initialState[userGroup.id] = false;
      });
      setButtonsLoadingState(initialState);
    }
  }, [loading]);

  const removeRegistrationLink = async () => {
    handleButtonChange(groupToRemove.id);
    const result = await deactivateUserGroup(groupToRemove.id);
    handleButtonChange(groupToRemove.id);
    if (result) {
      showToast('Grupp borttagen', `Gruppen ${groupToRemove.name} har tagits bort`, 'success');
      await getUserGroups();
      onGroupRemoved();
    } else {
      showToast('Någonting gick fel', `Gruppen ${groupToRemove.name} kunde inte tas bort`, 'error');
    }
    setGroupToRemove(null);
    setIsConfirmOpen(false);
  };

  const handleCloseConfirm = () => {
    setGroupToRemove(null);
    setIsConfirmOpen(false);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleButtonChange = (groupId) => {
    setButtonsLoadingState((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <TableContainer maxWidth='90%'>
          <Table variant='simple'>
            <TableCaption>Aktiva grupper i EDU-SIMS.</TableCaption>
            <Thead>
              <Tr>
                <Th>Användargrupp</Th>
                <Th>Kopiera länk</Th>
                <Th>Inaktivera användargrupp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userGroups &&
                userGroups.map(
                  (group, _index) =>
                    group.is_active !== false && (
                      <Tr key={group.id}>
                        <Td>{group.name}</Td>
                        <Td>
                          <IconButton
                            onClick={() => handleCopyLink(group.registration_link)}
                            icon={<CopyIcon />}
                            paddingTop={'10px'}
                            paddingBottom={'10px'}
                          />
                        </Td>
                        <Td>
                          <FormControl display={'flex'} flexDirection={'column'}>
                            <Button
                              onClick={() => {
                                setGroupToRemove(group);
                                setIsConfirmOpen(true);
                              }}
                              isLoading={buttonsLoadingState[group.id]}
                            >
                              Inaktivera
                            </Button>
                          </FormControl>
                        </Td>
                      </Tr>
                    ),
                )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Confirm
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        header={'Ta bort grupp'}
        body={
          'Är du säker på att du vill ta bort gruppen? Du kommer inte kunna aktivera gruppen igen'
        }
        handleConfirm={removeRegistrationLink}
      />
    </>
  );
}
