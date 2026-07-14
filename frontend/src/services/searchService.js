import apiClient from './apiClient';

export const searchLabTests = async (params) => {
  const { data } = await apiClient.get('/search', { params });
  return data.data; // { results, meta }
};
