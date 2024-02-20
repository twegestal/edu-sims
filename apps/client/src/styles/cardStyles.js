import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

/**
 * Sets up custom styles for the Chakra Card component
 */

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys,
);

const variants = {
  edu_card: definePartsStyle({
    container: {
      borderColor: 'black',
      borderWidth: '4px',
      backgroundColor: '#206bA9',
    },
  }),
};

export const cardTheme = defineMultiStyleConfig({ variants });
