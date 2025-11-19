-- Migration to add first_name column to profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE profiles
ADD COLUMN first_name TEXT NOT NULL DEFAULT '';

-- Update the constraint to make first_name required (remove default after adding data)
-- Uncomment the following line after running the migration if you want to remove the default
-- ALTER TABLE profiles ALTER COLUMN first_name DROP DEFAULT;

COMMENT ON COLUMN profiles.first_name IS 'User first name for personalized greetings';
