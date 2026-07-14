/**
 * Normalizes pagination query params and returns Supabase range + meta builder.
 */
const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
};

const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total: total || 0,
  totalPages: total ? Math.ceil(total / limit) : 0,
});

module.exports = { getPagination, buildMeta };
