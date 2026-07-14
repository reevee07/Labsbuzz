import apiClient from './apiClient';

export const getLabOwnerDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/lab-owner');
  return data.data;
};

export const getCustomerDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/customer');
  return data.data;
};
