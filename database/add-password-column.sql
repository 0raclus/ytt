-- Add password_hash column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update existing admin user with a default password (change this!)
-- Password: admin123
UPDATE user_profiles 
SET password_hash = '$2a$10$rOvHPZYQKjKxMxW5YJ5zKOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq'
WHERE email = 'ebrar@ytt.dev' AND password_hash IS NULL;

SELECT 'Password column added successfully!' as message;

