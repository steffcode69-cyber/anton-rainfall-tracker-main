-- Create rainfall_readings table to store rainfall measurements
CREATE TABLE IF NOT EXISTS public.rainfall_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_mm DECIMAL(10, 2) NOT NULL,
  reading_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create profiles table for user roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.rainfall_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rainfall_readings
DROP POLICY IF EXISTS "Anyone can view rainfall readings" ON public.rainfall_readings;
CREATE POLICY "Anyone can view rainfall readings" 
  ON public.rainfall_readings 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can insert rainfall readings" ON public.rainfall_readings;
CREATE POLICY "Admins can insert rainfall readings" 
  ON public.rainfall_readings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update rainfall readings" ON public.rainfall_readings;
CREATE POLICY "Admins can update rainfall readings" 
  ON public.rainfall_readings 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete rainfall readings" ON public.rainfall_readings;
CREATE POLICY "Admins can delete rainfall readings" 
  ON public.rainfall_readings 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
CREATE POLICY "Allow profile creation" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_rainfall_readings_date ON public.rainfall_readings(reading_date);
