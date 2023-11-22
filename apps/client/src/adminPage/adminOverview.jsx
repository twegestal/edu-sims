import React, { useState, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  return (
    <div>
      <Flex direction={'column'}>
        <h2>Adminvy</h2>
        <Link to={'/showStatistics'}>
          <Button>Se statistik</Button>
        </Link>
        <Link to={'/manageCases'}>
          <Button>Hantera fall</Button>
        </Link>
        <Link to={'/manageUsers'}>
          <Button>Hantera användare</Button>
        </Link>
      </Flex>
    </div>
  );
}
