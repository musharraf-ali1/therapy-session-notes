-- Database schema for Therapy Session Quick Notes
-- This file should be executed in your Supabase SQL Editor

-- Create the session_notes table
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  quick_notes TEXT NOT NULL CHECK (char_length(quick_notes) <= 500),
  session_duration INTEGER NOT NULL CHECK (session_duration >= 15 AND session_duration <= 120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on created_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_session_notes_created_at ON session_notes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for demo purposes
-- In production, you would want to restrict this based on user authentication
CREATE POLICY "Allow all operations for demo" ON session_notes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: If you want to disable RLS for demo purposes, uncomment the following:
-- ALTER TABLE session_notes DISABLE ROW LEVEL SECURITY;

-- Create a simple view for analytics (optional)
CREATE OR REPLACE VIEW session_notes_summary AS
SELECT 
  COUNT(*) as total_sessions,
  AVG(session_duration) as avg_duration,
  MAX(session_date) as last_session_date
FROM session_notes;

-- Grant access to the view
GRANT SELECT ON session_notes_summary TO anon, authenticated;

