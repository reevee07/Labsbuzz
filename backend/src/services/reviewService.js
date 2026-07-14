const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');

const recalculateLabRating = async (labId) => {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('rating')
    .eq('lab_id', labId);

  if (error) throw ApiError.internal(error.message);

  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  await supabaseAdmin
    .from('labs')
    .update({ rating: Math.round(avg * 10) / 10, review_count: count })
    .eq('id', labId);
};

const addReview = async (userId, { lab_id, rating, review }) => {
  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('lab_id', lab_id)
    .maybeSingle();

  if (existing) throw ApiError.conflict('You have already reviewed this lab');

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({ user_id: userId, lab_id, rating, review })
    .select('id, user_id, lab_id, rating, review, created_at')
    .single();

  if (error) throw ApiError.internal(error.message);

  await recalculateLabRating(lab_id);
  return data;
};

const listLabReviews = async (labId) => {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('id, rating, review, created_at, users ( id, name, avatar_url )')
    .eq('lab_id', labId)
    .order('created_at', { ascending: false });

  if (error) throw ApiError.internal(error.message);
  return data;
};

module.exports = { addReview, listLabReviews };
