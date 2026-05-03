import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nqrqpenmoicijgatmpei.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcnFwZW5tb2ljaWpnYXRtcGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjY3NTksImV4cCI6MjA5MzQwMjc1OX0._zz8dzlqU_MCHTMlwAchNtQ1T_42YRrAGz2bA7oUU1s'
);
