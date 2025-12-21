-- AlterTable: Add passwordHash column to Applicant table
ALTER TABLE "Applicant" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

-- AlterTable: Add passwordHash column to Company table
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

