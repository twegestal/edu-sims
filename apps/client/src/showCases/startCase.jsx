import { Button, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';

export default function StartCase({ caseId, caseToRandomise, published }) {
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
      {user.isAdmin ? (
        published ? (
          <Button
            onClick={postToAttemptNoReload}
            colorScheme='teal'
            marginBottom='10%'
            isLoading={loading}
          >
            Starta fallet
          </Button>
        ) : (
          <Tooltip
            hasArrow
            label='Fallet är inte publicerat och visas därför inte för studenter, men du som admin kan testa fallet'
          >
            <Button
              onClick={postToAttemptNoReload}
              colorScheme='teal'
              marginBottom='10%'
              isLoading={loading}
            >
              Testa fallet
            </Button>
          </Tooltip>
        )
      ) : (
        <Button
          onClick={postToAttemptNoReload}
          colorScheme='teal'
          marginBottom='10%'
          isLoading={loading}
        >
          Starta fallet
        </Button>
      )}

      {/* <Button
          onClick={postToAttemptReload}
          colorScheme='teal'
          marginBottom='5%'
          isLoading={loading}
        >
          Fortsätt fallet
        </Button> */}
    </>
  );
}
