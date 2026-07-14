import apiClient, { setAccessToken } from './apiClient';

export const registerUser = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const loginUser = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const logoutUser = async () => {
  await apiClient.post('/auth/logout');
  setAccessToken(null);
};

export const refreshSession = async () => {
  const { data } = await apiClient.post('/auth/refresh');
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const forgotPassword = async (email) => {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data.data;
};

export const resetPassword = async (token, password) => {
  const { data } = await apiClient.post('/auth/reset-password', { token, password });
  return data.data;
};

export const getMyProfile = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await apiClient.patch('/auth/me', payload);
  return data.data;
};
