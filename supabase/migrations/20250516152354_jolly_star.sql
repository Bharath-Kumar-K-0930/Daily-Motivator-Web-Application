/*
  # Add Challenge Badges and Progress Tracking

  1. Changes
    - Add badge requirements for challenges
    - Update user_challenges table with progress tracking
    - Add completed_tasks tracking
    
  2. Security
    - Maintain existing RLS policies
    - Add new policies for badge management
*/

-- Update user_challenges table with progress tracking
ALTER TABLE public.user_challenges
ADD COLUMN IF NOT EXISTS completed_tasks jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS current_day integer DEFAULT 1;

-- Update challenges table with detailed tasks
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS daily_tasks jsonb NOT NULL DEFAULT '[]';

-- Add badge requirements
ALTER TABLE public.badges
ADD COLUMN IF NOT EXISTS requirements jsonb NOT NULL DEFAULT '{}';

-- Insert challenge completion badges
INSERT INTO public.badges (name, description, image_url, category, requirements) VALUES
  ('30-Day Champion', 'Completed a 30-day challenge', 'https://example.com/badges/30-day-champion.png', 'health', '{"challenge_type": "health", "days_completed": 30}'),
  ('60-Day Master', 'Completed a 60-day challenge', 'https://example.com/badges/60-day-master.png', 'health', '{"challenge_type": "health", "days_completed": 60}'),
  ('100-Day Legend', 'Completed a 100-day challenge', 'https://example.com/badges/100-day-legend.png', 'health', '{"challenge_type": "health", "days_completed": 100}'),
  
  ('Coding Sprint', 'Completed a 30-day coding challenge', 'https://example.com/badges/coding-sprint.png', 'coding', '{"challenge_type": "coding", "days_completed": 30}'),
  ('Code Master', 'Completed a 60-day coding challenge', 'https://example.com/badges/code-master.png', 'coding', '{"challenge_type": "coding", "days_completed": 60}'),
  ('Code Legend', 'Completed a 100-day coding challenge', 'https://example.com/badges/code-legend.png', 'coding', '{"challenge_type": "coding", "days_completed": 100}'),
  
  ('Fitness Starter', 'Completed a 30-day fitness challenge', 'https://example.com/badges/fitness-starter.png', 'fitness', '{"challenge_type": "fitness", "days_completed": 30}'),
  ('Fitness Pro', 'Completed a 60-day fitness challenge', 'https://example.com/badges/fitness-pro.png', 'fitness', '{"challenge_type": "fitness", "days_completed": 60}'),
  ('Fitness Elite', 'Completed a 100-day fitness challenge', 'https://example.com/badges/fitness-elite.png', 'fitness', '{"challenge_type": "fitness", "days_completed": 100}')
ON CONFLICT DO NOTHING;

-- Update existing challenges with daily tasks
UPDATE public.challenges
SET daily_tasks = (
  SELECT json_agg(
    json_build_object(
      'id', 'task_' || day,
      'day', day,
      'task', CASE 
        WHEN category = 'coding' THEN 
          CASE day % 7
            WHEN 1 THEN 'Complete 2 algorithm challenges'
            WHEN 2 THEN 'Build a small project component'
            WHEN 3 THEN 'Learn a new programming concept'
            WHEN 4 THEN 'Refactor existing code'
            WHEN 5 THEN 'Write unit tests'
            WHEN 6 THEN 'Contribute to open source'
            ELSE 'Review and document your code'
          END
        WHEN category = 'fitness' THEN
          CASE day % 7
            WHEN 1 THEN 'Complete 30 minut