const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { getLabByOwner } = require('./labService');

const BOOKING_FIELDS = `
  id, user_id, lab_id, lab_test_id, booking_date, booking_time, booking_status,
  home_collection, address, notes, created_at,
  labs ( id, name, address, city, logo_url, phone ),
  lab_tests ( id, price, discounted_price, turnaround_time,
    tests ( id, test_name, category )
  )
`;

const createBooking = async (userId, payload) => {
  const { data: labTest, error: ltErr } = await supabaseAdmin
    .from('lab_tests')
    .select('id, lab_id, is_active')
    .eq('id', payload.lab_test_id)
    .maybeSingle();

  if (ltErr) throw ApiError.internal(ltErr.message);
  if (!labTest || !labTest.is_active) throw ApiError.notFound('Selected test is unavailable');
  if (labTest.lab_id !== payload.lab_id) {
    throw ApiError.badRequest('Test does not belong to the selected lab');
  }

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      user_id: userId,
      lab_id: payload.lab_id,
      lab_test_id: payload.lab_test_id,
      booking_date: payload.booking_date,
      booking_time: payload.booking_time,
      home_collection: payload.home_collection ?? false,
      address: payload.address ?? null,
      notes: payload.notes ?? null,
      booking_status: 'pending',
    })
    .select(BOOKING_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);

  await supabaseAdmin.from('notifications').insert({
    user_id: userId,
    message: `Your booking for ${payload.booking_date} at ${payload.booking_time} has been placed.`,
  });

  return booking;
};

const listMyBookings = async (userId, { status, page, limit }) => {
  const { page: p, limit: l, from, to } = getPagination({ page, limit });

  let query = supabaseAdmin
    .from('bookings')
    .select(BOOKING_FIELDS, { count: 'exact' })
    .eq('user_id', userId)
    .order('booking_date', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('booking_status', status);

  const { data, error, count } = await query;
  if (error) throw ApiError.internal(error.message);
  return { bookings: data, meta: buildMeta(p, l, count) };
};

const listLabBookings = async (ownerId, { status, page, limit }) => {
  const lab = await getLabByOwner(ownerId);
  const { page: p, limit: l, from, to } = getPagination({ page, limit });

  let query = supabaseAdmin
    .from('bookings')
    .select(
      `
      id, user_id, lab_id, lab_test_id, booking_date, booking_time, booking_status,
      home_collection, address, notes, created_at,
      users ( id, name, phone, email ),
      lab_tests ( id, price, discounted_price, turnaround_time, tests ( id, test_name, category ) )
    `,
      { count: 'exact' }
    )
    .eq('lab_id', lab.id)
    .order('booking_date', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('booking_status', status);

  const { data, error, count } = await query;
  if (error) throw ApiError.internal(error.message);
  return { bookings: data, meta: buildMeta(p, l, count) };
};

const updateBookingStatus = async (ownerId, bookingId, status) => {
  const lab = await getLabByOwner(ownerId);

  const { data: booking, error: findErr } = await supabaseAdmin
    .from('bookings')
    .select('id, lab_id, user_id')
    .eq('id', bookingId)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.lab_id !== lab.id) throw ApiError.forbidden('You do not manage this booking');

  const { data: updated, error } = await supabaseAdmin
    .from('bookings')
    .update({ booking_status: status })
    .eq('id', bookingId)
    .select(BOOKING_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);

  await supabaseAdmin.from('notifications').insert({
    user_id: booking.user_id,
    message: `Your booking status has been updated to "${status}".`,
  });

  return updated;
};

const cancelMyBooking = async (userId, bookingId) => {
  const { data: booking, error: findErr } = await supabaseAdmin
    .from('bookings')
    .select('id, user_id, booking_status')
    .eq('id', bookingId)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.user_id !== userId) throw ApiError.forbidden('You do not own this booking');
  if (['completed', 'cancelled'].includes(booking.booking_status)) {
    throw ApiError.badRequest(`Cannot cancel a ${booking.booking_status} booking`);
  }

  const { data: updated, error } = await supabaseAdmin
    .from('bookings')
    .update({ booking_status: 'cancelled' })
    .eq('id', bookingId)
    .select(BOOKING_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return updated;
};

module.exports = {
  createBooking,
  listMyBookings,
  listLabBookings,
  updateBookingStatus,
  cancelMyBooking,
};
