import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ManageDiagnosis from './ManageDiagnosis';
import ManageTreatment from './ManageTreatment';

export default function ManageLists() {
  return (
    <Tabs variant={'enclosed'}>
      <TabList>
        <Tab>Undersökningar</Tab>
        <Tab>Diagnoser</Tab>
        <Tab>Behandlingar</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>Undersökningar</p>
        </TabPanel>
        <TabPanel>
          <ManageDiagnosis />
        </TabPanel>
        <TabPanel>
          <ManageTreatment />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
