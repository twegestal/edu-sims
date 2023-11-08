import { Skeleton, Stack } from '@chakra-ui/react';

export default function LoadingSkeleton(count = 18) {
  return (
    <Stack>
      {[...Array(count)].map((_, index) => (
        <Skeleton key={index} height='20px'></Skeleton>
      ))}
    </Stack>
  );
}
