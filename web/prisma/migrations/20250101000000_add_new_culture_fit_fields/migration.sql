-- Drop old columns from Applicant table (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'workValues') THEN
        ALTER TABLE "Applicant" DROP COLUMN "workValues";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'teamStyle') THEN
        ALTER TABLE "Applicant" DROP COLUMN "teamStyle";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'workEnvironment') THEN
        ALTER TABLE "Applicant" DROP COLUMN "workEnvironment";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'motivation') THEN
        ALTER TABLE "Applicant" DROP COLUMN "motivation";
    END IF;
END $$;

-- Add new columns to Applicant table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'hierarchy') THEN
        ALTER TABLE "Applicant" ADD COLUMN "hierarchy" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'autonomy') THEN
        ALTER TABLE "Applicant" ADD COLUMN "autonomy" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'teamwork') THEN
        ALTER TABLE "Applicant" ADD COLUMN "teamwork" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'workStructure') THEN
        ALTER TABLE "Applicant" ADD COLUMN "workStructure" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'feedback') THEN
        ALTER TABLE "Applicant" ADD COLUMN "feedback" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Applicant' AND column_name = 'flexibility') THEN
        ALTER TABLE "Applicant" ADD COLUMN "flexibility" INTEGER;
    END IF;
END $$;

-- Drop old columns from Job table (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'workValues') THEN
        ALTER TABLE "Job" DROP COLUMN "workValues";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'teamStyle') THEN
        ALTER TABLE "Job" DROP COLUMN "teamStyle";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'workEnvironment') THEN
        ALTER TABLE "Job" DROP COLUMN "workEnvironment";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'motivation') THEN
        ALTER TABLE "Job" DROP COLUMN "motivation";
    END IF;
END $$;

-- Add new columns to Job table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'hierarchy') THEN
        ALTER TABLE "Job" ADD COLUMN "hierarchy" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'autonomy') THEN
        ALTER TABLE "Job" ADD COLUMN "autonomy" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'teamwork') THEN
        ALTER TABLE "Job" ADD COLUMN "teamwork" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'workStructure') THEN
        ALTER TABLE "Job" ADD COLUMN "workStructure" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'feedback') THEN
        ALTER TABLE "Job" ADD COLUMN "feedback" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'flexibility') THEN
        ALTER TABLE "Job" ADD COLUMN "flexibility" INTEGER;
    END IF;
END $$;

