const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');

const addFavorite = async (userId, labId) => {
  const { data: existing } = await supabaseAdmin
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('lab_id', labId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabaseAdmin
    .from('favorites')
    .insert({ user_id: userId, lab_id: labId })
    .select('id, user_id, lab_id, created_at')
    .single();

  if (error) throw ApiError.internal(error.message);
  return data;
};

const removeFavorite = async (userId, labId) => {
  const { error } = await supabaseAdmin
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('lab_id', labId);

  if (error) throw ApiError.internal(error.message);
  return { message: 'Removed from saved labs' };
};

const listFavorites = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .select(
      `id, created_at, labs ( id, name, address, city, logo_url, rating, review_count, verified, nabl_certified )`
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw ApiError.internal(error.message);
  return data;
};

module.exports = { addFavorite, removeFavorite, listFavorites };
