import apiClient from './apiClient';

export const listNearbyLabs = async (params) => {
  const { data } = await apiClient.get('/labs/nearby', { params });
  return data.data;
};

export const getLabById = async (id) => {
  const { data } = await apiClient.get(`/labs/${id}`);
  return data.data;
};

export const getMyLab = async () => {
  const { data } = await apiClient.get('/labs/me');
  return data.data;
};

export const createLab = async (payload) => {
  const { data } = await apiClient.post('/labs', payload);
  return data.data;
};

export const updateMyLab = async (payload) => {
  const { data } = await apiClient.patch('/labs/me', payload);
  return data.data;
};
