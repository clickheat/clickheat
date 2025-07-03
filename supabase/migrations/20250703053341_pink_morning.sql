/*
  # Real-time Schema Setup

  1. Tables
    - Ensures all tables exist with proper structure
    - Adds performance indexes for real-time operations
    - Sets up proper foreign key relationships

  2. Security
    - Enables RLS on all tables
    - Creates policies only if they don't exist
    - Maintains secure access patterns

  3. Functions & Triggers
    - User signup handling
    - Automatic timestamp updates
    - Real-time optimizations
*/

-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  page_type TEXT CHECK (page_type IN ('creator', 'business', 'custom')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bio pages table
CREATE TABLE IF NOT EXISTS public.bio_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Bio Page',
  description TEXT,
  theme TEXT DEFAULT 'default',
  custom_domain TEXT UNIQUE,
  is_published BOOLEAN DEFAULT FALSE,
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio_page_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  icon TEXT,
  style JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create click analytics table
CREATE TABLE IF NOT EXISTS public.click_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  bio_page_id UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better real-time performance
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_id ON public.bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_links_bio_page_id ON public.links(bio_page_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(position);
CREATE INDEX IF NOT EXISTS idx_click_analytics_user_id ON public.click_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_link_id ON public.click_analytics(link_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON public.click_analytics(clicked_at);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop and recreate profiles policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  
  CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
  
  CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
  
  CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
END $$;

-- Drop and recreate bio_pages policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own bio pages" ON public.bio_pages;
  
  CREATE POLICY "Users can manage own bio pages" ON public.bio_pages
    FOR ALL USING (auth.uid() = user_id);
END $$;

-- Drop and recreate links policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage links through bio pages" ON public.links;
  
  CREATE POLICY "Users can manage links through bio pages" ON public.links
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.bio_pages 
        WHERE bio_pages.id = links.bio_page_id 
        AND bio_pages.user_id = auth.uid()
      )
    );
END $$;

-- Drop and recreate click_analytics policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own analytics" ON public.click_analytics;
  DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.click_analytics;
  
  CREATE POLICY "Users can view own analytics" ON public.click_analytics
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Anyone can insert analytics" ON public.click_analytics
    FOR INSERT WITH CHECK (true);
END $$;

-- Create function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
  CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_bio_pages_updated_at ON public.bio_pages;
  CREATE TRIGGER update_bio_pages_updated_at
    BEFORE UPDATE ON public.bio_pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_links_updated_at ON public.links;
  CREATE TRIGGER update_links_updated_at
    BEFORE UPDATE ON public.links
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END $$;