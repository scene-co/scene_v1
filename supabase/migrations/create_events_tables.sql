-- Migration: Create events and event_participants tables
-- Created: 2025-12-08

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  host_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['sports'::text, 'academic'::text, 'social'::text, 'cultural'::text, 'technical'::text, 'other'::text])),
  max_participants integer CHECK (max_participants > 0),
  current_participants integer DEFAULT 0,
  images text[] DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'cancelled'::text, 'completed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS public.event_participants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'attending'::text CHECK (status = ANY (ARRAY['attending'::text, 'maybe'::text, 'not_attending'::text])),
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_participants_pkey PRIMARY KEY (id),
  CONSTRAINT event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT event_participants_unique UNIQUE (event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_host_id ON public.events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON public.event_participants(user_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
-- Anyone can view active events
CREATE POLICY "Anyone can view active events"
  ON public.events FOR SELECT
  USING (status = 'active' OR auth.uid() = host_id);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Event hosts can update their own events
CREATE POLICY "Hosts can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Event hosts can delete their own events
CREATE POLICY "Hosts can delete their own events"
  ON public.events FOR DELETE
  USING (auth.uid() = host_id);

-- RLS Policies for event_participants table
-- Anyone can view event participants
CREATE POLICY "Anyone can view event participants"
  ON public.event_participants FOR SELECT
  USING (true);

-- Authenticated users can join events
CREATE POLICY "Authenticated users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own participation status
CREATE POLICY "Users can update their own participation"
  ON public.event_participants FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can remove themselves from events
CREATE POLICY "Users can remove themselves from events"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update current_participants count
CREATE OR REPLACE FUNCTION update_event_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'attending' THEN
    UPDATE public.events
    SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'attending' THEN
    UPDATE public.events
    SET current_participants = GREATEST(current_participants - 1, 0)
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'attending' AND NEW.status != 'attending' THEN
      UPDATE public.events
      SET current_participants = GREATEST(current_participants - 1, 0)
      WHERE id = NEW.event_id;
    ELSIF OLD.status != 'attending' AND NEW.status = 'attending' THEN
      UPDATE public.events
      SET current_participants = current_participants + 1
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update participant count
DROP TRIGGER IF EXISTS update_event_participants_count_trigger ON public.event_participants;
CREATE TRIGGER update_event_participants_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.event_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_event_participants_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
