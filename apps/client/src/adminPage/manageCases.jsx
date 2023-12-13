import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ShowAllCases from '../showCases/show_all_cases';

export default function AdminOverview(props) {
  return (
    <div>
      <h2>Hantera fall</h2>
      <ShowAllCases
        getCallToApi={props.getCallToApi}
        postCallToApi={props.postCallToApi}
        user={props.user}
      ></ShowAllCases>
      <Link to={'/caseBuilder'}>
        <Button>Skapa nytt fall</Button>
      </Link>
    </div>
  );
}
