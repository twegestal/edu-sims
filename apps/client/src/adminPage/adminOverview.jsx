import React, { useState, useEffect } from 'react';
import { 
  Button,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Text,
  Box,
} from '@chakra-ui/react';
import{
  ArrowForwardIcon,
} from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import ShowStatistics from './statistics/showStatistics.jsx';

export default function AdminOverview() {
  return (
    <div>
      <Flex direction={'column'} justifyContent={'space-between'} marginTop={'5%'}>
        <Flex justifyContent={'space-around'} width={'50%'} margin={'auto'}  marginBottom={'50px'} flexDirection={'column'} maxWidth={'415px'}>
          <Link to={'/manageCases'}>
            <Box bg={'#ccccd2'} padding={'20px'} borderRadius={'10px'} marginBottom={'20px'}>
              <Text>Skapa & ändra fall </Text>
              <ArrowForwardIcon/>
            </Box>
          </Link>
          <Link to={'/manageUsers'} >
            <Box bg={'#ccccd2'} padding={'20px'} borderRadius={'10px'} marginBottom={'20px'}>
              <Text>Skapa & hantera anvädare </Text>
                <ArrowForwardIcon/>
            </Box>
          </Link>
          <Link to='/manageLists'>
            <Box bg={'#ccccd2'} padding={'20px'} borderRadius={'10px'}>
              <Text>Hantera listor</Text>
                <ArrowForwardIcon/>
            </Box>
          </Link>
        </Flex>
        <ShowStatistics/>
      </Flex>
    </div>
  );
}
