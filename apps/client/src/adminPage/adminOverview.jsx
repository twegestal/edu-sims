import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';


export default function AdminOverview(props) {

  return (
    <div>
      <Flex direction={'column'}>
        <h2>Adminvy</h2>

        <Button>Se statistik</Button>
        <Button>Hantera användare</Button>

        <Link to={'/manageCases'}>
            <Button>Hantera fall</Button>
        </Link>
      </Flex>
    </div>
  );

}