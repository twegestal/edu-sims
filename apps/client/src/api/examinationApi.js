import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'examination/';

export const examinationApi = (apiClient) => ({
  
  getExaminationList: async (headers) => {
    const response = await apiClient.get(`${prefix}`, headers);
    return packageResponse(response);
  },

  addNewExamination: async (body) => {
    const response = await apiClient.post(`${prefix}`, body);
    return packageResponse(response);
  },

  updateExamination: async (body) => {
    const response = await apiClient.patch(`${prefix}`, body);
    return packageResponse(response);
  },

  deleteExamination: async (body) => {
    const response = await apiClient.delete(`${prefix}`, body);
    return packageResponse(response);
  },

  getAllExaminationTypes: async (headers) => {
    const response = await apiClient.get(`${prefix}/type`, headers);
    return packageResponse(response);
  },

  getExaminationTypes: async (headers) => {
    const response = await apiClient.get(`${prefix}/type`, headers);
    return packageResponse(response);
  },

  addNewExaminationType: async (body) => {
    const response = await apiClient.post(`${prefix}/type`, body);
    return packageResponse(response);
  },

  editExaminationType: async (body) => {
    const response = await apiClient.patch(`${prefix}/type`, body);
    return packageResponse(response);
  },

  deleteExaminationType: async (body) => {
    const response = await apiClient.delete(`${prefix}/type`, body);
    return packageResponse(response);
  },

  getAllExaminationSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}/subtype`, headers);
    return packageResponse(response);
  },
  
  getExaminationSubtypes: async (headers) => {
    const response = await apiClient.get(`${prefix}/subtype`, headers);
    return packageResponse(response);
  },

  addNewExaminationSubtype: async (body) => {
    const response = await apiClient.post(`${prefix}/subtype`, body);
    return packageResponse(response);
  },

  editExaminationSubtype: async (body) => {
    const response = await apiClient.patch(`${prefix}/subtype`, body);
    return packageResponse(response);
  },

  deleteExaminationSubtype: async (body) => {
    const response = await apiClient.delete(`${prefix}/subtype`, body);
    return packageResponse(response);
  },

  editExaminationRange: async (body) => {
    const response = await apiClient.patch(`${prefix}examinationRange`, body);
    return packageResponse(response);
  },

})