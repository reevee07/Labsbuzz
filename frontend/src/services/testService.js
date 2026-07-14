import apiClient from './apiClient';

export const listCategories = async () => {
  const { data } = await apiClient.get('/tests/categories');
  return data.data;
};

export const searchCatalogue = async (q) => {
  const { data } = await apiClient.get('/tests/catalogue', { params: { q } });
  return data.data;
};

export const listMyTests = async () => {
  const { data } = await apiClient.get('/tests/me');
  return data.data;
};

export const addTest = async (payload) => {
  const { data } = await apiClient.post('/tests', payload);
  return data.data;
};

export const updateTest = async (id, payload) => {
  const { data } = await apiClient.patch(`/tests/${id}`, payload);
  return data.data;
};

export const deleteTest = async (id) => {
  const { data } = await apiClient.delete(`/tests/${id}`);
  return data.data;
};
