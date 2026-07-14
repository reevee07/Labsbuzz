import apiClient from './apiClient';

export const listFavorites = async () => {
  const { data } = await apiClient.get('/favorites');
  return data.data;
};

export const addFavorite = async (labId) => {
  const { data } = await apiClient.post(`/favorites/${labId}`);
  return data.data;
};

export const removeFavorite = async (labId) => {
  const { data } = await apiClient.delete(`/favorites/${labId}`);
  return data.data;
};
