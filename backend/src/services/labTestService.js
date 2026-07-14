const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { findOrCreateTest } = require('./testService');
const { getLabByOwner } = require('./labService');

const LAB_TEST_FIELDS = `
  id, lab_id, test_id, price, discounted_price, turnaround_time, home_collection, is_active, created_at,
  tests ( id, test_name, category )
`;

const addLabTest = async (ownerId, payload) => {
  const lab = await getLabByOwner(ownerId);

  let testId = payload.test_id;
  if (!testId) {
    const test = await findOrCreateTest({
      test_name: payload.test_name,
      category: payload.category,
    });
    testId = test.id;
  }

  const { data: existing } = await supabaseAdmin
    .from('lab_tests')
    .select('id')
    .eq('lab_id', lab.id)
    .eq('test_id', testId)
    .maybeSingle();

  if (existing) throw ApiError.conflict('This test is already listed for your lab');

  const { data: labTest, error } = await supabaseAdmin
    .from('lab_tests')
    .insert({
      lab_id: lab.id,
      test_id: testId,
      price: payload.price,
      discounted_price: payload.discounted_price ?? null,
      turnaround_time: payload.turnaround_time,
      home_collection: payload.home_collection ?? false,
    })
    .select(LAB_TEST_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return labTest;
};

const listLabTests = async (ownerId) => {
  const lab = await getLabByOwner(ownerId);

  const { data, error } = await supabaseAdmin
    .from('lab_tests')
    .select(LAB_TEST_FIELDS)
    .eq('lab_id', lab.id)
    .order('created_at', { ascending: false });

  if (error) throw ApiError.internal(error.message);
  return data;
};

const updateLabTest = async (ownerId, labTestId, updates) => {
  const lab = await getLabByOwner(ownerId);

  const { data: labTest, error: findErr } = await supabaseAdmin
    .from('lab_tests')
    .select('id, lab_id')
    .eq('id', labTestId)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (!labTest) throw ApiError.notFound('Test listing not found');
  if (labTest.lab_id !== lab.id) throw ApiError.forbidden('You do not own this test listing');

  const { data: updated, error } = await supabaseAdmin
    .from('lab_tests')
    .update(updates)
    .eq('id', labTestId)
    .select(LAB_TEST_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return updated;
};

const deleteLabTest = async (ownerId, labTestId) => {
  const lab = await getLabByOwner(ownerId);

  const { data: labTest, error: findErr } = await supabaseAdmin
    .from('lab_tests')
    .select('id, lab_id')
    .eq('id', labTestId)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (!labTest) throw ApiError.notFound('Test listing not found');
  if (labTest.lab_id !== lab.id) throw ApiError.forbidden('You do not own this test listing');

  const { error } = await supabaseAdmin.from('lab_tests').delete().eq('id', labTestId);
  if (error) throw ApiError.internal(error.message);
  return { message: 'Test removed successfully' };
};

module.exports = { addLabTest, listLabTests, updateLabTest, deleteLabTest, LAB_TEST_FIELDS };
