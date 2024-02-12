import { HStack, Switch, Text, useColorMode } from '@chakra-ui/react';

export const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack>
      <Switch colorScheme='telegram' isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      <Text>Dark Mode</Text>
    </HStack>
  );
};
