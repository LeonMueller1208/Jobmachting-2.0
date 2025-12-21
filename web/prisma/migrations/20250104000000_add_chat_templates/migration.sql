-- CreateTable (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ChatTemplate') THEN
        CREATE TABLE "ChatTemplate" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "companyId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "isDefault" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "ChatTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
    END IF;
END $$;

-- CreateIndex (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'ChatTemplate' 
        AND indexname = 'ChatTemplate_companyId_idx'
    ) THEN
        CREATE INDEX "ChatTemplate_companyId_idx" ON "ChatTemplate"("companyId");
    END IF;
END $$;

