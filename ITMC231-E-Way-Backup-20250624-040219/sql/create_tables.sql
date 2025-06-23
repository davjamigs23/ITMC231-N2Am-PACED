-- Enable Row Level Security
ALTER SYSTEM SET max_locks_per_transaction = 128;

-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create models table
CREATE TABLE IF NOT EXISTS public.models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10, 2),
    range INTEGER,
    top_speed INTEGER,
    battery_capacity TEXT,
    motor_power TEXT,
    weight TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create policies for brands
CREATE POLICY "Enable read access for all users" 
ON public.brands 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON public.brands 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.brands 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.brands 
FOR DELETE 
TO authenticated 
USING (true);

-- Create policies for models
CREATE POLICY "Enable read access for all users" 
ON public.models 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON public.models 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.models 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.models 
FOR DELETE 
TO authenticated 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER update_brands_modtime
BEFORE UPDATE ON public.brands
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_models_modtime
BEFORE UPDATE ON public.models
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brands_name ON public.brands (name);
CREATE INDEX IF NOT EXISTS idx_models_brand_id ON public.models (brand_id);
CREATE INDEX IF NOT EXISTS idx_models_name ON public.models (name);

-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
