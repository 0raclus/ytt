/*
  # Add Public Read Policies

  1. Changes
    - Allow authenticated users to read events
    - Allow authenticated users to read plants
    - Allow authenticated users to read event categories
    - These are needed for normal user experience

  2. Security
    - Only SELECT is allowed publicly
    - Create/Update/Delete still require proper permissions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read events" ON events;
DROP POLICY IF EXISTS "Authenticated users can read plants" ON plants;
DROP POLICY IF EXISTS "Authenticated users can read event categories" ON event_categories;

-- Allow all authenticated users to read events
CREATE POLICY "Authenticated users can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to read plants
CREATE POLICY "Authenticated users can read plants"
  ON plants
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to read event categories
CREATE POLICY "Authenticated users can read event categories"
  ON event_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to read plant categories
CREATE POLICY "Authenticated users can read plant categories"
  ON plant_categories
  FOR SELECT
  TO authenticated
  USING (true);
