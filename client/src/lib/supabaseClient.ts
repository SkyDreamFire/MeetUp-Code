import { createClient } from '@supabase/supabase-js';

const supabaseUrl =' https://qszutntlsvdcgdshlclt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzenV0bnRsc3ZkY2dkc2hsY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzc1MzIsImV4cCI6MjA2NzExMzUzMn0.sXyz2QRi4puEd8XlTUsAQhJLbwDmjUMTi-1S2RQJWlc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);