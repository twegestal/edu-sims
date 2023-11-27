import React, { useState, useEffect } from 'react';
import { Button, Flex, Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react';
import { useStatistics } from '../hooks/useStatistic.js';

export default function ShowStatistics(props) {
  const { getTotalAmountUsers, amountUser, getActiveUsers, activeUsers, allCasesStatistics } =
    useStatistics();

  useEffect(() => {
    const getStatistics = async () => {
      await getTotalAmountUsers();

      const previousDate = getPreviousDate(7);
      getActiveUsers(previousDate);
    };

    getStatistics();
  }, []);

  const jsonToCsv = (data) => {
    const rows = [];

    // Extract headers from the object keys
    const headers = Object.keys(data.data[0]);
    rows.push(headers.join(';'));

    // Extract data for each object in the array
    data.data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];

        // Check if the value is a date and format accordingly
        if (value instanceof Date) {
          return value.toISOString();
        }

        return value;
      });

      rows.push(values.join(';'));
    });

    return rows.join('\n');
  };

  const handleDownloadReports = async () => {
    const fetchedData = await allCasesStatistics();
    const csvData = jsonToCsv(fetchedData);

    const url = window.URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    const fileName = `EDU-SIMS_statistik.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getPreviousDate = (daysAgo) => {
    const currentDate = new Date();
    const datePrevious = new Date(currentDate);
    datePrevious.setUTCDate(currentDate.getUTCDate() - daysAgo);

    const formattedDate = datePrevious.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    });

    return formattedDate;
  };

  return (
    <div>
      <Flex direction={'column'}>
        <h2>Statistik</h2>

        <Button onClick={handleDownloadReports}>Ladda ner CSV fil med statistik</Button>

        <StatGroup>
          <Stat>
            <StatLabel>Totalt antal användare</StatLabel>
            <StatNumber>{amountUser}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Aktiva användare senaste veckan</StatLabel>
            <StatNumber>{activeUsers}</StatNumber>
          </Stat>
        </StatGroup>
      </Flex>
    </div>
  );
}
