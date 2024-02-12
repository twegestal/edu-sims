import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function Examination({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };
  return (
    <>
      <p>Utredningsgrejer</p>
      {isFinished === false && <Button onClick={finishStep}>Gör färdigt steget</Button>}
    </>
  );
}
