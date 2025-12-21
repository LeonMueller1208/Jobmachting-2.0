-- AlterTable: Add archiving fields to Chat table
ALTER TABLE "Chat" ADD COLUMN IF NOT EXISTS "archivedByApplicant" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Chat" ADD COLUMN IF NOT EXISTS "archivedByCompany" BOOLEAN NOT NULL DEFAULT false;

