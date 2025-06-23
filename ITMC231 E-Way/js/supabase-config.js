// Supabase configuration
const SUPABASE_URL = 'https://kivksqpoojfrtfmjfrch.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdmtzcXBvb2pmcnRmbWpmcmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTEwMjUsImV4cCI6MjA2NTkyNzAyNX0.1DjX5Bx195aLyAJY37x2TpOksFS92GVflHc7u97v2LQ';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export the Supabase client
export { supabase };
