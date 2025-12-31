-- Migration: Add field of study columns to Applicant and Job tables
-- Run this in Supabase SQL Editor

-- Add field of study columns to Applicant table
ALTER TABLE "Applicant" 
ADD COLUMN IF NOT EXISTS "fieldOfStudy" TEXT,
ADD COLUMN IF NOT EXISTS "fieldOfStudyCategory" TEXT;

-- Add required fields of study to Job table
ALTER TABLE "Job" 
ADD COLUMN IF NOT EXISTS "requiredFieldsOfStudy" JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN "Applicant"."fieldOfStudy" IS 'Field of study for university degrees (e.g., BWL, VWL, Maschinenbau)';
COMMENT ON COLUMN "Applicant"."fieldOfStudyCategory" IS 'Category of field of study: Wirtschaft, Ingenieurwesen, Sonstige';
COMMENT ON COLUMN "Job"."requiredFieldsOfStudy" IS 'Array of required fields of study. Empty array means all fields accepted.';

