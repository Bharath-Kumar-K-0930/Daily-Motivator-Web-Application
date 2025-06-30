-- Create scheduled_notifications table
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id SERIAL PRIMARY KEY,
  notification_id INT NOT NULL REFERENCES scheduled_notifications(id),
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
