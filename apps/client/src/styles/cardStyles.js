import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys,
);

// define custom styles for funky variant
const variants = {
  edu_card: definePartsStyle({
    container: {
      borderColor: 'black',
      borderWidth: '4px',
      backgroundColor: '#206bA9',
    },
  }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({ variants });
