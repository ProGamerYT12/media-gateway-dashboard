
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwziqpnzelwpfxjapnaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3emlxcG56ZWx3cGZ4amFwbmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Mzg5NTEsImV4cCI6MjA1NTUxNDk1MX0.IkJ2in_E25RUndU3_h_0NL_Zp_RBV0e6BcvdD3Y4mpI';

export const supabase = createClient(supabaseUrl, supabaseKey);
