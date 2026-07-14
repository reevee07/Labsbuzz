import apiClient from './apiClient';

export const createBooking = async (payload) => {
  const { data } = await apiClient.post('/bookings', payload);
  return data.data;
};

export const listMyBookings = async (params) => {
  const { data } = await apiClient.get('/bookings/me', { params });
  return data.data;
};

export const listLabBookings = async (params) => {
  const { data } = await apiClient.get('/bookings/lab', { params });
  return data.data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/bookings/${id}/status`, { status });
  return data.data;
};

export const cancelMyBooking = async (id) => {
  const { data } = await apiClient.patch(`/bookings/${id}/cancel`);
  return data.data;
};
