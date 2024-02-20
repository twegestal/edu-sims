import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
/**
 * Sets up custom styles for the Chakra Input component
 */

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

const edu_input = definePartsStyle({
  field: {
    border: '2px solid',
    borderColor: 'black',
    background: 'gray.50',

    _dark: {
      borderColor: 'gray.600',
      background: 'gray.800',
    },
  },
});

export const inputTheme = defineMultiStyleConfig({
  variants: { edu_input },
});
