-- Manual migration script for ChatTemplate table
-- Run this in Supabase SQL Editor if the migration hasn't been applied automatically

-- CreateTable
CREATE TABLE IF NOT EXISTS "ChatTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatTemplate_companyId_idx" ON "ChatTemplate"("companyId");

