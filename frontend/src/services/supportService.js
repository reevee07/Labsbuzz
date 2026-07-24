// frontend/src/services/supportService.js
import apiClient from './apiClient';

export const submitSupportRequest = async (payload) => {
  const { data } = await apiClient.post('/support', payload);
  return data.data;
};