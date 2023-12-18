import { extendTheme } from '@chakra-ui/react';

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
    Button: {
      baseStyle: {
        // ...define your base styles
      },
      variants: {
        // Make a variant, we'll call it `base` here and leave it empty
        base: {
          bg: '#D2D2D2',
          whiteSpace:"normal",
          height:"auto",
          blockSize:"auto",
          paddingTop: '10px',
          paddingBottom: '10px'
        },
        good: {
          bg: '#4CB963',
        },
        caseNav: {
          bg: '#3182ce',
          color: '#f5faf6',
        },
      },
      defaultProps: {
        // Then here we set the base variant as the default
        variant: 'base',
      },
    },
  },
});

export default extendTheme(theme);
