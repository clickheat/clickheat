/*
  # A/B Testing Tables Migration

  1. New Tables
    - `ab_tests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, test name)
      - `status` (text, test status: draft, running, completed, paused)
      - `variant_a_id` (uuid, foreign key to bio_pages)
      - `variant_b_id` (uuid, foreign key to bio_pages)
      - `traffic_split` (integer, percentage split)
      - `goal` (text, test goal: ctr, specific_link, total_clicks)
      - `target_link_id` (uuid, optional foreign key to links)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `auto_promote_winner` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `ab_test_results`
      - `id` (uuid, primary key)
      - `test_id` (uuid, foreign key to ab_tests)
      - `variant` (text, A or B)
      - `views` (integer)
      - `clicks` (integer)
      - `conversions` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own tests
*/

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'running', 'completed', 'paused')) DEFAULT 'draft',
  variant_a_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  variant_b_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  traffic_split INTEGER DEFAULT 50 CHECK (traffic_split >= 10 AND traffic_split <= 90),
  goal TEXT CHECK (goal IN ('ctr', 'specific_link', 'total_clicks')) DEFAULT 'ctr',
  target_link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_promote_winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ab_test_results table
CREATE TABLE IF NOT EXISTS public.ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.ab_tests(id) ON DELETE CASCADE NOT NULL,
  variant TEXT CHECK (variant IN ('A', 'B')) NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_id, variant)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON public.ab_test_results(test_id);

-- Enable RLS
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ab_tests
CREATE POLICY "Users can manage own ab tests" ON public.ab_tests
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ab_test_results
CREATE POLICY "Users can view own test results" ON public.ab_test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ab_tests 
      WHERE ab_tests.id = ab_test_results.test_id 
      AND ab_tests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own test results" ON public.ab_test_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.ab_tests 
      WHERE ab_tests.id = ab_test_results.test_id 
      AND ab_tests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own test results" ON public.ab_test_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ab_tests 
      WHERE ab_tests.id = ab_test_results.test_id 
      AND ab_tests.user_id = auth.uid()
    )
  );

-- Add updated_at trigger for ab_tests
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_ab_tests_updated_at ON public.ab_tests;
  CREATE TRIGGER update_ab_tests_updated_at
    BEFORE UPDATE ON public.ab_tests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END $$;

-- Add updated_at trigger for ab_test_results
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_ab_test_results_updated_at ON public.ab_test_results;
  CREATE TRIGGER update_ab_test_results_updated_at
    BEFORE UPDATE ON public.ab_test_results
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END $$;