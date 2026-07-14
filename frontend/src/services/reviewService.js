import apiClient from './apiClient';

export const listLabReviews = async (labId) => {
  const { data } = await apiClient.get(`/reviews/lab/${labId}`);
  return data.data;
};

export const addReview = async (payload) => {
  const { data } = await apiClient.post('/reviews', payload);
  return data.data;
};
