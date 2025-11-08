import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://cnpztgdzhvhuzciydske.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucHp0Z2R6aHZodXpjaXlkc2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDMxMDAsImV4cCI6MjA2NjM3OTEwMH0.ZULLwFvUZQmG4E6q_KkQP9uFc1JSxeqb072kwrKaTI8';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };