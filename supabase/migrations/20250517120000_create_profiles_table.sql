-- Create profiles table for user profile data
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  whatsapp_number text,
  notification_times jsonb DEFAULT '["06:00", "12:00", "18:00"]',
  selected_interests jsonb DEFAULT '[]',
  enable_notifications boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
