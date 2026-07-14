const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');

/**
 * Global master-test catalogue (test_name + category), shared across all labs.
 * Lab-specific pricing lives in the lab_tests join table (see labTestService).
 */
const findOrCreateTest = async ({ test_name, category }) => {
  const { data: existing, error: findErr } = await supabaseAdmin
    .from('tests')
    .select('id, test_name, category')
    .ilike('test_name', test_name)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (existing) return existing;

  const { data: created, error } = await supabaseAdmin
    .from('tests')
    .insert({ test_name, category })
    .select('id, test_name, category')
    .single();

  if (error) throw ApiError.internal(error.message);
  return created;
};

const listTestCategories = async () => {
  const { data, error } = await supabaseAdmin.from('tests').select('category');
  if (error) throw ApiError.internal(error.message);
  return [...new Set(data.map((t) => t.category))].sort();
};

const searchTestCatalogue = async (query) => {
  const { data, error } = await supabaseAdmin
    .from('tests')
    .select('id, test_name, category')
    .ilike('test_name', `%${query}%`)
    .limit(10);

  if (error) throw ApiError.internal(error.message);
  return data;
};

module.exports = { findOrCreateTest, listTestCategories, searchTestCatalogue };
