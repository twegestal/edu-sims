import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  accordionAnatomy.keys,
);

const edu_exam_type = definePartsStyle({
  button: {
    backgroundColor: '#002db5',
    color: 'white',

    _expanded: {
      backgroundColor: '#002db5',
      color: 'white',
    },

    _hover: {
      backgroundColor: '#002db5',
      color: 'white',
    },
  },

  container: {
    border: '2px solid',
    borderRadius: '10px',
    borderColor: 'gray.300',
    marginBottom: '1%',
    marginTop: '1%',
    backgroundColor: '#f2f2f2',
  },

  icon: {
    color: 'white',
  },
  panel: {
    padding: '1%',
  },

  /* panel: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.50',
    borderRadius: 'full',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: 'gray.600',
      background: 'gray.800',
    },
  },
  icon: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.200',
    borderRadius: 'full',
    color: 'gray.500',

    _dark: {
      borderColor: 'gray.600',
      background: 'gray.600',
      color: 'gray.400',
    },
  }, */
});

const edu_exam_subtype = definePartsStyle({
  button: {
    backgroundColor: '#204dd5',
    color: 'white',

    _expanded: {
      backgroundColor: '#204dd5',
      color: 'white',
    },

    _hover: {
      backgroundColor: '#204dd5',
      color: 'white',
    },
  },

  container: {
    border: '2px solid',
    borderRadius: '10px',
    borderColor: 'gray.300',
    marginBottom: '1%',
    marginTop: '1%',
    backgroundColor: '#f2f2f2',
  },

  icon: {
    color: 'white',
  },
  panel: {
    padding: '1%',
  },
});

export const accordionTheme = defineMultiStyleConfig({
  variants: { edu_exam_type, edu_exam_subtype },
});

// Now we can use the new `custom` variant
{
  /* <Accordion variant="custom"> ... </Accordion> */
}
