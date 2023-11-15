import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';


export default function ShowStatistics(props) {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {

        const getStatistics = async () => {
            //Skall ersättas med API kall

            const apiData = {
                'total_users': 80,
                'active_users_week': 10
            }

            setStatistics(apiData)
        };

        getStatistics()

    }, []);


    const jsonToCsv = (json) => {
    const rows = [];

    // Extract headers from the first object in the array
    const headers = Object.keys(json[0]);
    rows.push(headers.join(','));

    // Extract data for each object in the array
    json.forEach((row) => {
        const values = headers.map((header) => row[header]);
        rows.push(values.join(','));
    });

    return rows.join('\n');
    };

    const handleDownloadReports = async () => {
        const apiData = [{
            'total_users': 80,
            'active_users_week': 10
        }]

    const csvData = jsonToCsv(apiData);

    console.log("response", statistics)
    const url = window.URL.createObjectURL(new Blob([csvData], { type: 'text/csv' })) 
    const link = document.createElement('a')
    link.href = url
    const fileName = `EDU-SIMS_statistik.csv`;
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    }

  return (
    <div>
      <Flex direction={'column'}>
        <h2>Statistik</h2>

        <Button onClick={handleDownloadReports} >Ladda ner CSV fil med statistik</Button>

        <StatGroup>
            <Stat>
                <StatLabel>Totalt antal användare</StatLabel>
                <StatNumber>{statistics.total_users}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Aktiva användare senaste veckan</StatLabel>
                <StatNumber>{statistics.active_users_week}</StatNumber>
            </Stat>
        </StatGroup>
      </Flex>
    </div>
  );

}