const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { haversineDistanceKm } = require('../utils/geo');

const LAB_FIELDS =
  'id, owner_id, name, address, city, state, pincode, latitude, longitude, rating, review_count, logo_url, phone, verified, nabl_certified, opens_at, closes_at, created_at';

const createLab = async (ownerId, payload) => {
  const { data: existing } = await supabaseAdmin
    .from('labs')
    .select('id')
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (existing) throw ApiError.conflict('You have already registered a lab');

  const { data: lab, error } = await supabaseAdmin
    .from('labs')
    .insert({ ...payload, owner_id: ownerId })
    .select(LAB_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return lab;
};

const getLabByOwner = async (ownerId) => {
  const { data: lab, error } = await supabaseAdmin
    .from('labs')
    .select(LAB_FIELDS)
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!lab) throw ApiError.notFound('Lab profile not found. Please register your lab first.');
  return lab;
};

const getLabById = async (labId, userLat, userLng) => {
  const { data: lab, error } = await supabaseAdmin
    .from('labs')
    .select(LAB_FIELDS)
    .eq('id', labId)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!lab) throw ApiError.notFound('Lab not found');

  if (userLat !== undefined && userLng !== undefined) {
    lab.distance_km = haversineDistanceKm(userLat, userLng, lab.latitude, lab.longitude);
  }
  return lab;
};

const updateLab = async (ownerId, labId, updates) => {
  const { data: lab, error: findErr } = await supabaseAdmin
    .from('labs')
    .select('id, owner_id')
    .eq('id', labId)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (!lab) throw ApiError.notFound('Lab not found');
  if (lab.owner_id !== ownerId) throw ApiError.forbidden('You do not own this lab');

  const { data: updated, error } = await supabaseAdmin
    .from('labs')
    .update(updates)
    .eq('id', labId)
    .select(LAB_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return updated;
};

const listNearbyLabs = async ({ lat, lng, radius, page, limit }) => {
  const { page: p, limit: l, from, to } = getPagination({ page, limit });

  const { data: labs, error, count } = await supabaseAdmin
    .from('labs')
    .select(LAB_FIELDS, { count: 'exact' })
    .eq('verified', true)
    .range(from, to);

  if (error) throw ApiError.internal(error.message);

  let results = labs;
  if (lat !== undefined && lng !== undefined) {
    results = labs
      .map((lab) => ({
        ...lab,
        distance_km: haversineDistanceKm(lat, lng, lab.latitude, lab.longitude),
      }))
      .filter((lab) => lab.distance_km === null || lab.distance_km <= radius)
      .sort((a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity));
  }

  return { labs: results, meta: buildMeta(p, l, count) };
};

module.exports = {
  createLab,
  getLabByOwner,
  getLabById,
  updateLab,
  listNearbyLabs,
  LAB_FIELDS,
};
