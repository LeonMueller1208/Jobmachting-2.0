-- Migration: Add passwordHash columns to Applicant and Company tables
-- Run this script manually in Supabase SQL Editor if the migration doesn't run automatically

-- Add passwordHash column to Applicant table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Applicant' AND column_name = 'passwordHash'
    ) THEN
        ALTER TABLE "Applicant" ADD COLUMN "passwordHash" TEXT;
    END IF;
END $$;

-- Add passwordHash column to Company table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Company' AND column_name = 'passwordHash'
    ) THEN
        ALTER TABLE "Company" ADD COLUMN "passwordHash" TEXT;
    END IF;
END $$;

-- Verify columns were added
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('Applicant', 'Company') 
    AND column_name = 'passwordHash';

