-- Add is_estimated column to track whether a date is estimated
-- This is useful for historical data where exact dates are unknown
ALTER TABLE public.rainfall_readings 
ADD COLUMN IF NOT EXISTS is_estimated BOOLEAN DEFAULT false;

-- Add a note column for additional context about the reading
ALTER TABLE public.rainfall_readings 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create index for faster queries on estimated readings
CREATE INDEX IF NOT EXISTS idx_rainfall_readings_estimated ON public.rainfall_readings(is_estimated);
