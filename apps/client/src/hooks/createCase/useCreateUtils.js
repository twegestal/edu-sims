import { useState, useEffect } from 'react';
import { useCreateCase } from '../useCreateCase';

export const useCreateCaseUtils = () => {
  const [treatmentTypes, setTreatmentTypes] = useState();
  const [treatmentSubtypes, setTreatmentSubtypes] = useState();
  const [treatmentList, setTreatmentList] = useState();

  const { getTreatmentTypes, getTreatmentSubtypes, getTreatmentList } = useCreateCase();

  const fetchTreatmentTypes = async () => {
    const treatmentTypes = await getTreatmentTypes();

    const treatmentTypeMap = {};
    const treatmentSubtypeMap = {};
    const treatmentListMap = {};

    for (let i = 0; i < treatmentTypes.length; i++) {
      treatmentTypeMap[treatmentTypes[i].id] = treatmentTypes[i].name;

      const treatmentSubtypes = await getTreatmentSubtypes(treatmentTypes[i].id);

      //let treatmentSubtypeArray = [];
      let subtypeObject = {};
      for (let j = 0; j < treatmentSubtypes.length; j++) {
        /* let newEntry = {
          id: treatmentSubtypes[j].id,
          name: treatmentSubtypes[j].name,
        }; */
        subtypeObject[treatmentSubtypes[j].id] = treatmentSubtypes[j].name;
        //treatmentSubtypeArray.push(newEntry);

        const treatments = await getTreatmentList(treatmentSubtypes[j].id);
        let treatmentsArray = [];
        for (let k = 0; k < treatments.length; k++) {
          let newEntry = {
            id: treatments[k].id,
            name: treatments[k].name,
          };
          treatmentsArray.push(newEntry);
          treatmentListMap[treatmentSubtypes[j].id] = treatmentsArray;
        }
      }
      treatmentSubtypeMap[treatmentTypes[i].id] = subtypeObject;
    }

    setTreatmentTypes(treatmentTypeMap);
    setTreatmentSubtypes(treatmentSubtypeMap);
    setTreatmentList(treatmentListMap);
  };

  return {
    fetchTreatmentTypes,
    treatmentTypes,
    treatmentSubtypes,
    treatmentList,
  };
};
