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
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser';
import LoadingSkeleton from '../loadingSkeleton';

export default function UserGroupsCard({ reloading, onGroupRemoved }) {
  const { userGroups, getUserGroups, deactivateUserGroup } = useUser();
  const [loading, setLoading] = useState(true);
  const [buttonsLoadingState, setButtonsLoadingState] = useState([]);

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

  const removeRegistrationLink = async (id) => {
    handleButtonChange(id);
    const result = await deactivateUserGroup(id);
    handleButtonChange(id);
    if (result === true) {
      await getUserGroups();
      onGroupRemoved();
    }
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

  return (
    <div>
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
                              onClick={() => removeRegistrationLink(group.id)}
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
    </div>
  );
}
