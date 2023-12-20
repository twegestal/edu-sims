import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ShowAllCases from '../showCases/show_all_cases';

export default function AdminOverview() {
  return (
    <div>
      <h2>Hantera fall</h2>
      <ShowAllCases />
      <Link to={'/caseBuilder'}>
        <Button marginTop={'20px'}>Skapa nytt fall</Button>
      </Link>
    </div>
  );
}
