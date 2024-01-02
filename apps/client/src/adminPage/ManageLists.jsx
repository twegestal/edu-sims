import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ManageDiagnosis from './ManageDiagnosis';
import ManageTreatment from './ManageTreatment';
import ManageExamination from './ManageExamination';
import ManageRange from './ManageRange';
import { useState } from 'react';

export default function ManageLists() {
  const [reload, setReload] = useState(false);

  const examinationListEdited = () => {
    setReload(!reload);
  };
  return (
    <Tabs variant={'enclosed'}>
      <TabList>
        <Tab>Diagnoser</Tab>
        <Tab>Behandlingar</Tab>
        <Tab>Undersökningar</Tab>
        <Tab>Normalvärden</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ManageDiagnosis />
        </TabPanel>
        <TabPanel>
          <ManageTreatment />
        </TabPanel>
        <TabPanel>
          <ManageExamination examinationListEdited={examinationListEdited} />
        </TabPanel>
        <TabPanel>
          <ManageRange update={reload} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
