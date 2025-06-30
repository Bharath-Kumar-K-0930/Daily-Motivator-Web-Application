-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);
