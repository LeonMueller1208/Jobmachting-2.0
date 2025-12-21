-- AlterTable: Add company profile fields (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'description') THEN
        ALTER TABLE "Company" ADD COLUMN "description" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'website') THEN
        ALTER TABLE "Company" ADD COLUMN "website" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'companySize') THEN
        ALTER TABLE "Company" ADD COLUMN "companySize" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Company' AND column_name = 'foundedYear') THEN
        ALTER TABLE "Company" ADD COLUMN "foundedYear" INTEGER;
    END IF;
END $$;

