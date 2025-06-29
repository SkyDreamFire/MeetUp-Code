import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqgevcrjsvvyrtcogean.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZ2V2Y3Jqc3Z2eXJ0Y29nZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNDAxNzcsImV4cCI6MjA2NjcxNjE3N30.2e5y9wBE6owaOt8d4bUX_-DhqwEAANuNR1xZodDQvc4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
