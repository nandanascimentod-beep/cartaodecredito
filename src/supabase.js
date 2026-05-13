import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ywqktsklkftfooujbsbo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MmsEYddqCfGgmC2bWjXX0g_5EV5qrjB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
