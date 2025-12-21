-- Manual Migration: Add Company Profile Fields
-- Execute this in Supabase SQL Editor if automatic migration didn't work

-- Add company profile fields (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'description') THEN
        ALTER TABLE "Company" ADD COLUMN "description" TEXT;
        RAISE NOTICE 'Added description column';
    ELSE
        RAISE NOTICE 'description column already exists';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'website') THEN
        ALTER TABLE "Company" ADD COLUMN "website" TEXT;
        RAISE NOTICE 'Added website column';
    ELSE
        RAISE NOTICE 'website column already exists';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'companySize') THEN
        ALTER TABLE "Company" ADD COLUMN "companySize" TEXT;
        RAISE NOTICE 'Added companySize column';
    ELSE
        RAISE NOTICE 'companySize column already exists';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'foundedYear') THEN
        ALTER TABLE "Company" ADD COLUMN "foundedYear" INTEGER;
        RAISE NOTICE 'Added foundedYear column';
    ELSE
        RAISE NOTICE 'foundedYear column already exists';
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Company' 
AND column_name IN ('description', 'website', 'companySize', 'foundedYear')
ORDER BY column_name;

