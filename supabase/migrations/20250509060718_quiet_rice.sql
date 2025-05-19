/*
  # Initial Schema Setup
  
  1. New Tables
    - profiles: User profile data
    - challenges: Weekly art challenges
    - submissions: User artwork submissions
    - votes: User votes on submissions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
  
  3. Features
    - Automatic vote counting via trigger
    - Unique constraint on votes
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  is_pro boolean DEFAULT false,
  daily_image_count integer DEFAULT 0,
  last_image_reset timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  image_url text NOT NULL,
  title text,
  description text,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(submission_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DO $$ BEGIN
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Challenges policies
DO $$ BEGIN
  CREATE POLICY "Anyone can read challenges"
    ON challenges
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Submissions policies
DO $$ BEGIN
  CREATE POLICY "Anyone can read submissions"
    ON submissions
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can create submissions"
    ON submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Votes policies
DO $$ BEGIN
  CREATE POLICY "Users can read own votes"
    ON votes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create votes"
    ON votes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own votes"
    ON votes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create function to update submission votes count
CREATE OR REPLACE FUNCTION update_submission_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE submissions
    SET votes = votes + 1
    WHERE id = NEW.submission_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE submissions
    SET votes = votes - 1
    WHERE id = OLD.submission_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for votes
DO $$ BEGIN
  CREATE TRIGGER update_submission_votes_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_submission_votes();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;