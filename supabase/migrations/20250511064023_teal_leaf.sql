/*
  # Enhanced User Features Schema

  1. New Tables
    - `interests` - User interest categories
    - `challenges` - Challenge definitions
    - `user_challenges` - User challenge progress
    - `notifications` - User notification preferences
    - `badges` - Achievement badges
    - `user_badges` - User earned badges

  2. Changes
    - Add interests and notification preferences to profiles table
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
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

-- RLS Policies

-- Interests policies
CREATE POLICY "Interests are viewable by everyone"
  ON public.interests FOR SELECT
  TO public
  USING (true);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone"
  ON public.challenges FOR SELECT
  TO public
  USING (true);

-- User challenges policies
CREATE POLICY "Users can view own challenges"
  ON public.user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON public.user_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON public.user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  TO public
  USING (true);

-- User badges policies
CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Insert sample challenges
INSERT INTO public.challenges (title, description, interest_id, duration_days, daily_tasks, difficulty) 
SELECT 
  '30 Days of Coding',
  'Build your programming skills with daily coding challenges',
  id,
  30,
  '[
    {"day": 1, "task": "Set up your development environment"},
    {"day": 2, "task": "Complete 2 easy coding problems"},
    {"day": 3, "task": "Learn about arrays and complete related exercises"}
  ]'::jsonb,
  'intermediate'
FROM public.interests 
WHERE category = 'coding'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample badges
INSERT INTO public.badges (name, description, image_url, category, requirements) VALUES
  ('Code Warrior', 'Completed the 30-day coding challenge', 'https://example.com/badges/code-warrior.png', 'coding', '{"challenge_id": "30-days-coding", "days_completed": 30}'),
  ('Fitness Champion', 'Completed the fitness challenge', 'https://example.com/badges/fitness-champion.png', 'fitness', '{"challenge_id": "fitness-30", "days_completed": 30}'),
  ('Mindfulness Master', 'Achieved mindfulness goals', 'https://example.com/badges/mindfulness.png', 'mental-health', '{"challenge_id": "mindfulness-21", "days_completed": 21}')
ON CONFLICT DO NOTHING;