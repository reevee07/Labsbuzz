const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { getLabByOwner } = require('./labService');

/**
 * Lab Owner dashboard summary cards: total bookings, pending bookings,
 * revenue (from completed bookings), and active test count.
 */
const getLabOwnerStats = async (ownerId) => {
  const lab = await getLabByOwner(ownerId);

  const [{ count: totalBookings }, { count: pendingBookings }, { data: completed }, { count: activeTests }] =
    await Promise.all([
      supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('lab_id', lab.id),
      supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('lab_id', lab.id)
        .eq('booking_status', 'pending'),
      supabaseAdmin
        .from('bookings')
        .select('lab_test_id, lab_tests(price, discounted_price)')
        .eq('lab_id', lab.id)
        .eq('booking_status', 'completed'),
      supabaseAdmin
        .from('lab_tests')
        .select('id', { count: 'exact', head: true })
        .eq('lab_id', lab.id)
        .eq('is_active', true),
    ]);

  const revenue = (completed || []).reduce((sum, b) => {
    const price = b.lab_tests?.discounted_price ?? b.lab_tests?.price ?? 0;
    return sum + Number(price);
  }, 0);

  return {
    lab,
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    revenue,
    activeTests: activeTests || 0,
  };
};

/**
 * Customer dashboard summary: counts by booking status.
 */
const getCustomerStats = async (userId) => {
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const counts = {};

  await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('booking_status', status);
      if (error) throw ApiError.internal(error.message);
      counts[status] = count || 0;
    })
  );

  return counts;
};

module.exports = { getLabOwnerStats, getCustomerStats };
