const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

const listNotifications = async (userId, { page, limit }) => {
  const { page: p, limit: l, from, to } = getPagination({ page, limit });

  const { data, error, count } = await supabaseAdmin
    .from('notifications')
    .select('id, message, read, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw ApiError.internal(error.message);
  return { notifications: data, meta: buildMeta(p, l, count) };
};

const markAsRead = async (userId, notificationId) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select('id, message, read, created_at')
    .single();

  if (error) throw ApiError.internal(error.message);
  return data;
};

const markAllAsRead = async (userId) => {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw ApiError.internal(error.message);
  return { message: 'All notifications marked as read' };
};

module.exports = { listNotifications, markAsRead, markAllAsRead };
