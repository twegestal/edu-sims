import { useState } from 'react';
import { useApi } from './useApi';

export const useTreatment = () => {
  const getTreatmentStepApi = useApi('getTreatmentStep');
  const getTreatmentTypesApi = useApi('getTreatmentTypes');
  const getTreatmentSubtypesApi = useApi('getTreatmentSubtypes');
  const addNewTreatmentSubtypeApi = useApi('addNewTreatmentSubtype');
  const getTreatmentListApi = useApi('getTreatmentList');
  const getTreatmentSpecificValuesApi = useApi('getTreatmentSpecificValues');
  const addNewTreatmentApi = useApi('addNewTreatment');
  const addNewTreatmentTypeApi = useApi('addNewTreatmentType');
  const updateTreatmentApi = useApi('updateTreatment');
  const deleteTreatmentApi = useApi('deleteTreatment');

  const [treatmentStep, setTreatmentStep] = useState({});
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  const [treatmentSubtypes, setTreatmentSubtypes] = useState();
  const [treatmentSpecificValues, setTreatmentSpecificValues] = useState([]);
  const [treatmentList, setTreatmentList] = useState();

  const getTreatmentStep = async (id) => {
    try {
      const response = await getTreatmentStepApi({ headers: { id: id } });
      if (response.status === 200) {
        setTreatmentStep(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment step: ', error);
    }
  };

  const getTreatmentSpecificValues = async (id) => {
    try {
      const response = await getTreatmentSpecificValuesApi({ headers: { id: id } });
      if (response.status === 200) {
        setTreatmentSpecificValues(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment specific values: ', error);
    }
  };

  const getTreatmentTypes = async () => {
    try {
      const response = await getTreatmentTypesApi();
      if (response.status === 200) {
        setTreatmentTypes(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment types: ', error);
    }
  };

  const getTreatmentSubTypes = async () => {
    try {
      const response = await getTreatmentSubtypesApi();
      if (response.status === 200) {
        setTreatmentSubtypes(response.data);
      }
    } catch (error) {
      console.error('error fetching treatment subtypes ', error);
    }
  };

  const addNewTreatmentSubtype = async (name, id) => {
    try {
      const response = await addNewTreatmentSubtypeApi({ body: { name: name, id: id }});
      return response.status === 201;
    } catch (error) {
      console.error('error adding new treatment subtype ', error);
    }
  }

  const addNewTreatmentType = async (name) => {
    try {
      const response = await addNewTreatmentTypeApi({ body: { name: name } });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new treatment type ', error);
    }
  };

  const getTreatmentList = async (id) => {
    try {
      const response = await getTreatmentListApi({ headers: { id: id } });
      if ((response.status = 200)) {
        setTreatmentList(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('error fetching treatment list: ', error);
    }
  };

  const addTreatment = async (name, subtypeId, treatmentId) => {
    try {
      const response = await addNewTreatmentApi({
        body: { name: name, subtypeId: subtypeId, treatmentId: treatmentId },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error adding new treatment ', error);
    }
  };

  const updateTreatment = async (name, id) => {
    try {
      const response = await updateTreatmentApi({ body: { id: id, newName: name } });
      return response.status === 200;
    } catch (error) {
      console.error('error updating treatment ', error);
    }
  };

  const deleteTreatment = async (id) => {
    try {
      const response = await deleteTreatmentApi({ body: { id: id } });
      return response.status;
    } catch (error) {
      console.log('error deleting treatment', error);
      return error.response.status;
    }
  };

  return {
    treatmentStep,
    getTreatmentStep,
    treatmentSpecificValues,
    getTreatmentSpecificValues,
    treatmentTypes,
    getTreatmentTypes,
    treatmentList,
    getTreatmentList,
    treatmentSubtypes,
    getTreatmentSubTypes,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    addNewTreatmentType,
    addNewTreatmentSubtype
  };
};
