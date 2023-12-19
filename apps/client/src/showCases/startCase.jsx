import { Button, ButtonGroup } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';

export default function StartCase({ caseId, caseToRandomise }) {
  const { user } = useAuth();
  const { createAttempt } = useCases();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caseToRandomise === caseId) {
      postToAttemptNoReload();
    }
  }, [caseToRandomise]);

  const postToAttemptNoReload = async () => {
    setLoading(true);
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, caseId);
    return navigate(
      '/case/caseid=' + caseId + '/attemptid=' + createdAttempt.id + '/reload=' + false,
    );
  };

  const postToAttemptReload = async () => {
    setLoading(true);
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, caseId);
    return navigate(
      '/case/caseid=' + caseId + '/attemptid=' + createdAttempt.id + '/reload=' + true,
    );
  };

  return (
    <>
      <ButtonGroup>
        <Button
          onClick={postToAttemptNoReload}
          colorScheme='teal'
          marginBottom='2%'
          isLoading={loading}
        >
          Starta fallet
        </Button>
        {/* <Button
          onClick={postToAttemptReload}
          colorScheme='teal'
          marginBottom='5%'
          isLoading={loading}
        >
          Fortsätt fallet
        </Button> */}
      </ButtonGroup>
    </>
  );
}
