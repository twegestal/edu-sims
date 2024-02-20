import { InputGroup, InputLeftElement, InputRightElement, Input } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useState } from 'react';

/**
 * Generic searchbar component that can be reused throughout the project.
 * The required properties are:
 * onSearch - a function implemented in the parent component that receives a string
 *            containing the search term inputted in the search bar
 */

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <InputGroup>
      <InputLeftElement>
        <SearchIcon />
      </InputLeftElement>
      <Input
        placeholder='Sök...'
        value={searchTerm}
        variant='edu_input'
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
      ></Input>
      {searchTerm && (
        <InputRightElement
          onClick={(e) => {
            setSearchTerm('');
            onSearch('');
          }}
        >
          <IoIosCloseCircleOutline />
        </InputRightElement>
      )}
    </InputGroup>
  );
}
