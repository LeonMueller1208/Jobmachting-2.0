-- Migration: Make email optional for Applicant and Company
-- Execute this in Supabase SQL Editor

-- Make email optional for Applicant table
ALTER TABLE "Applicant" ALTER COLUMN "email" DROP NOT NULL;

-- Make email optional for Company table  
ALTER TABLE "Company" ALTER COLUMN "email" DROP NOT NULL;

-- Note: The unique constraint on email will still work, but NULL values are allowed
-- Multiple NULL values are allowed in PostgreSQL unique constraints

