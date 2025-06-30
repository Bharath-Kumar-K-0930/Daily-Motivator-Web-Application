/*
  # Enhanced Schema with 100-Day Challenges

  1. Changes
    - Add notification preferences to profiles
    - Create tables for interests, challenges, badges
    - Update challenge duration to 100 days
    - Add comprehensive daily tasks
    
  2. Security
    - Enable RLS on all tables
    - Add policies with existence checks
*/

-- Add notification preferences to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_times text[] DEFAULT ARRAY['04:00', '05:00', '06:00', '07:00', '10:00'],
ADD COLUMN IF NOT EXISTS selected_interests text[] DEFAULT '{}';

-- Create interests table
CREATE TABLE IF NOT EXISTS public.interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  interest_id uuid REFERENCES public.interests(id),
  duration_days integer NOT NULL,
  daily_tasks jsonb NOT NULL,
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES public.challenges(id),
  start_date timestamptz DEFAULT now(),
  current_day integer DEFAULT 1,
  completed_tasks jsonb DEFAULT '[]',
  status text DEFAULT 'in_progress',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  requirements jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES public.badges(id),
  earned_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies with existence checks
DO $$
BEGIN
    -- Interests policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'interests' AND policyname = 'Interests are viewable by everyone'
    ) THEN
        CREATE POLICY "Interests are viewable by everyone"
            ON public.interests FOR SELECT
            TO public
            USING (true);
    END IF;

    -- Challenges policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'challenges' AND policyname = 'Challenges are viewable by everyone'
    ) THEN
        CREATE POLICY "Challenges are viewable by everyone"
            ON public.challenges FOR SELECT
            TO public
            USING (true);
    END IF;

    -- User challenges policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_challenges' AND policyname = 'Users can view own challenges'
    ) THEN
        CREATE POLICY "Users can view own challenges"
            ON public.user_challenges FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_challenges' AND policyname = 'Users can insert own challenges'
    ) THEN
        CREATE POLICY "Users can insert own challenges"
            ON public.user_challenges FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_challenges' AND policyname = 'Users can update own challenges'
    ) THEN
        CREATE POLICY "Users can update own challenges"
            ON public.user_challenges FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Badges policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Badges are viewable by everyone'
    ) THEN
        CREATE POLICY "Badges are viewable by everyone"
            ON public.badges FOR SELECT
            TO public
            USING (true);
    END IF;

    -- User badges policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_badges' AND policyname = 'Users can view own badges'
    ) THEN
        CREATE POLICY "Users can view own badges"
            ON public.user_badges FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Insert initial interests
INSERT INTO public.interests (name, description, category) VALUES
  ('Health & Wellness', 'Improve your physical and mental well-being', 'health'),
  ('Fitness Journey', 'Achieve your fitness goals step by step', 'fitness'),
  ('Mental Resilience', 'Overcome challenges and build mental strength', 'mental-health'),
  ('Relationship Building', 'Strengthen your relationships and social connections', 'relationships'),
  ('Daily Coding', 'Build your programming skills consistently', 'coding'),
  ('Productivity Mastery', 'Enhance your productivity and time management', 'productivity'),
  ('Mindfulness', 'Practice mindfulness and reduce stress', 'mental-health'),
  ('Career Growth', 'Advance your professional development', 'career')
ON CONFLICT DO NOTHING;

-- Insert sample challenges with 100-day duration
INSERT INTO public.challenges (title, description, interest_id, duration_days, daily_tasks, difficulty) 
SELECT 
  '100 Days of Coding',
  'Master programming with our comprehensive 100-day coding challenge',
  id,
  100,
  (
    SELECT json_agg(
      json_build_object(
        'day', day,
        'task', CASE 
          WHEN day % 7 = 1 THEN 'Complete 2 algorithm challenges'
          WHEN day % 7 = 2 THEN 'Build a small project component'
          WHEN day % 7 = 3 THEN 'Learn a new programming concept'
          WHEN day % 7 = 4 THEN 'Refactor existing code'
          WHEN day % 7 = 5 THEN 'Write unit tests'
          WHEN day % 7 = 6 THEN 'Contribute to open source'
          ELSE 'Review and document your code'
        END
      )
    )
    FROM generate_series(1, 100) day
  ),
  'intermediate'
FROM public.interests 
WHERE category = 'coding'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample badges with attractive designs
INSERT INTO public.badges (name, description, image_url, category, requirements) VALUES
  ('Code Master', 'Completed the 100-day coding challenge', 'https://example.com/badges/code-master.png', 'coding', '{"challenge_id": "100-days-coding", "days_completed": 100}'),
  ('Fitness Elite', 'Completed the 100-day fitness challenge', 'https://example.com/badges/fitness-elite.png', 'fitness', '{"challenge_id": "fitness-100", "days_completed": 100}'),
  ('Mindfulness Guru', 'Mastered 100 days of mindfulness', 'https://example.com/badges/mindfulness-guru.png', 'mental-health', '{"challenge_id": "mindfulness-100", "days_completed": 100}')
ON CONFLICT DO NOTHING;