import { extendTheme } from '@chakra-ui/react';
import { ButtonStyles as Button } from './buttonStyles';
import { dividerTheme as Divider } from './divider';
import { accordionTheme as Accordion } from './accordionStyles';
import { inputTheme as Input } from './inputStyles';
import { cardTheme as Card } from './cardStyles';

const theme = extendTheme({
  fonts: {
    heading: '"Avenir Next", sans-serif',
    body: '"Open Sans", sans-serif',
  },
  colors: {
    brand: {
      bg: '#f2f2f2',
      text: '#fff',
      card: '#0A99FF',
      neutralButton: '#737373',
    },
    gu: {
      bg: '#004b89',
    },
    success: {
      bg: '#8BD49A',
    },
    fail: {
      bg: '#E05D65',
    },
  },
  components: {
    Button,
    Divider,
    Accordion,
    Input,
    Card,
  },
});

export default extendTheme(theme);
