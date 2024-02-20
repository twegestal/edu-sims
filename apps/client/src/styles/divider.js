import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

/**
 * Sets up custom styles for the Chakra Divider component
 */

const thick = defineStyle({
  borderWidth: '5px', // change the width of the border
  borderStyle: 'solid', // change the style of the border
  borderRadius: 10, // set border radius to 10
  borderColor: 'orange.300',
});
const brandPrimary = defineStyle({
  borderWidth: '3px',
  borderStyle: 'dashed',
  borderColor: 'orange.500',

  // let's also provide dark mode alternatives
  _dark: {
    borderColor: 'orange.300',
  },
});
const edu = defineStyle({
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: 'gray.400',
  borderRadius: '2px',
});

export const dividerTheme = defineStyleConfig({
  variants: { thick, brandPrimary, edu },
});
