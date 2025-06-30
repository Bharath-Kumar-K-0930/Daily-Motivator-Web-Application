-- Add WhatsApp number column to profiles table
ALTER TABLE public.profiles
ADD COLUMN whatsapp_number text;
