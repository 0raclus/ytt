/*
  # Add Unique Constraint on user_id

  1. Changes
    - Add unique constraint on user_profiles.user_id
    - This prevents duplicate profile entries

  2. Security
    - Ensures data integrity
*/

-- Add unique constraint on user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;
