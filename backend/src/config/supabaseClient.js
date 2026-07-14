const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const logger = require('./logger');

/**
 * Service-role client - used ONLY on the backend for privileged operations.
 * Row Level Security is bypassed by this client, so all authorization
 * checks (ownership, role) MUST be enforced in controllers/services.
 *
 * Uses safe placeholder values when env vars are missing so the server can
 * still boot locally (e.g. before Supabase is provisioned). Any actual
 * database call will fail with a clear error until real credentials are set.
 */
const url = env.SUPABASE_URL || 'https://placeholder.supabase.co';
const key = env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.warn(
    '[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. Database calls will fail until configured in .env'
  );
}

const supabaseAdmin = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = { supabaseAdmin };
