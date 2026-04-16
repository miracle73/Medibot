// This file defines the database schema. For Vercel Postgres,
// you'll need to run these SQL migrations manually or via a migration tool.

export const schemaSQL = `
-- Create users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  daily_checks_used INTEGER DEFAULT 0,
  last_check_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create symptom_checks table
CREATE TABLE IF NOT EXISTS symptom_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  conditions JSONB NOT NULL,
  severity VARCHAR(50) NOT NULL,
  recommendations TEXT[] NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_symptom_checks_user_id ON symptom_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_checks_created_at ON symptom_checks(created_at DESC);

-- Function to reset daily checks (can be called daily via cron)
CREATE OR REPLACE FUNCTION reset_daily_checks()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET daily_checks_used = 0,
      last_check_date = CURRENT_DATE
  WHERE subscription_tier = 'free'
    AND (last_check_date IS NULL OR last_check_date < CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;
`;