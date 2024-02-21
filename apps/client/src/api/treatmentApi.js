import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'treatment/';

export const treatmentApi = (apiClient) => ({

    getTreatmentList: async (headers) => {
        const response = await apiClient.get(`${prefix}`, headers);
        return packageResponse(response);
    },
    postTreatment: async (body) => {
        const response = await apiClient.post(`${prefix}`, body);
        return packageResponse(response);
    },
    patchTreatment: async (body) => {
        const response = await apiClient.patch(`${prefix}`, body);
        return packageResponse(response);
    },
    deleteTreatment: async (body) => {
        const response = await apiClient.delete(`${prefix}`, body);
        return packageResponse(response);
    },
    getTreatmentTypes: async () => {
        const response = await apiClient.get(`${prefix}type`);
        return packageResponse(response);
    },
    addNewTreatmentType: async (body) => {
        const response = await apiClient.post(`${prefix}type`, body);
        return packageResponse(response);
    },
    editTreatmentType: async (body) => {
        const response = await apiClient.patch(`${prefix}type`, body);
        return packageResponse(response);
    },
    deleteTreatmentType: async (body) => {
        const response = await apiClient.delete(`${prefix}type`, body);
        return packageResponse(response);
    },
    getTreatmentSubtypes: async (headers) => {
        const response = await apiClient.get(`${prefix}subtype`, headers);
        return packageResponse(response);
    },
    addNewTreatmentSubtype: async (body) => {
        const response = await apiClient.post(`${prefix}subtype`, body);
        return packageResponse(response);
    },
    editTreatmentSubtype: async (body) => {
        const response = await apiClient.patch(`${prefix}subtype`, body);
        return packageResponse(response);
    },
    deleteTreatmentSubtype: async (body) => {
        const response = await apiClient.delete(`${prefix}subtype`, body);
        return packageResponse(response);
    },

})