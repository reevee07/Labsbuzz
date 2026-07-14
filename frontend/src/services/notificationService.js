import apiClient from './apiClient';

export const listNotifications = async () => {
  const { data } = await apiClient.get('/notifications');
  return data.data;
};

export const markAsRead = async (id) => {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data.data;
};

export const markAllAsRead = async () => {
  const { data } = await apiClient.patch('/notifications/read-all');
  return data.data;
};
