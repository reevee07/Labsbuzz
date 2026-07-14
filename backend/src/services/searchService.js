const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { haversineDistanceKm } = require('../utils/geo');

/**
 * Core search & compare engine.
 * Joins lab_tests -> tests + labs, applies text search, geo filter,
 * feature filters, then sorts and paginates in-memory (post geo-filter)
 * since Postgres/Supabase free tier has no PostGIS by default here.
 * For 10k+ labs scale, this should move to a PostGIS RPC / materialized view.
 */
const searchLabTests = async (params) => {
  const {
    q,
    category,
    lat,
    lng,
    radius = 25,
    sortBy = 'distance',
    homeCollection,
    nablCertified,
    minRating,
    page,
    limit,
  } = params;

  const { page: p, limit: l } = getPagination({ page, limit });

  let query = supabaseAdmin
    .from('lab_tests')
    .select(
      `
      id, price, discounted_price, turnaround_time, home_collection, is_active,
      tests ( id, test_name, category ),
      labs ( id, name, address, city, latitude, longitude, rating, review_count, logo_url, verified, nabl_certified, opens_at, closes_at )
    `
    )
    .eq('is_active', true);

  if (category) {
    query = query.eq('tests.category', category);
  }
  if (homeCollection) {
    query = query.eq('home_collection', true);
  }

  const { data, error } = await query;
  if (error) throw ApiError.internal(error.message);

  let results = (data || [])
    .filter((row) => row.tests && row.labs && row.labs.verified)
    .filter((row) =>
      q ? row.tests.test_name.toLowerCase().includes(q.toLowerCase()) ||
          row.labs.name.toLowerCase().includes(q.toLowerCase())
        : true
    )
    .filter((row) => (nablCertified ? row.labs.nabl_certified : true))
    .filter((row) => (minRating ? row.labs.rating >= minRating : true))
    .map((row) => {
      const distance_km =
        lat !== undefined && lng !== undefined
          ? haversineDistanceKm(lat, lng, row.labs.latitude, row.labs.longitude)
          : null;
      const savings = row.discounted_price
        ? Math.round(row.price - row.discounted_price)
        : 0;
      return {
        lab_test_id: row.id,
        test: row.tests,
        lab: row.labs,
        price: row.price,
        discounted_price: row.discounted_price,
        savings,
        turnaround_time: row.turnaround_time,
        home_collection: row.home_collection,
        distance_km,
      };
    });

  if (lat !== undefined && lng !== undefined) {
    results = results.filter((r) => r.distance_km === null || r.distance_km <= radius);
  }

  const sorters = {
    price_low: (a, b) => (a.discounted_price ?? a.price) - (b.discounted_price ?? b.price),
    price_high: (a, b) => (b.discounted_price ?? b.price) - (a.discounted_price ?? a.price),
    distance: (a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity),
    turnaround: (a, b) => (a.turnaround_time || '').localeCompare(b.turnaround_time || ''),
    rating: (a, b) => (b.lab.rating || 0) - (a.lab.rating || 0),
  };
  results.sort(sorters[sortBy] || sorters.distance);

  const total = results.length;
  const from = (p - 1) * l;
  const paginated = results.slice(from, from + l);

  return { results: paginated, meta: buildMeta(p, l, total) };
};

module.exports = { searchLabTests };
