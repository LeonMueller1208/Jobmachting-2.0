-- ============================================
-- Cleanup: Lösche alte Testdaten
-- Löscht alle Jobs, Chats und Interests die vor dem 28.10.2025 erstellt wurden
-- ============================================
-- 
-- WICHTIG: Dieses Script löscht Daten dauerhaft!
-- Führe es nur aus, wenn du sicher bist.
--
-- Ausführung: Kopiere dieses Script in den Supabase SQL Editor und führe es aus
-- ============================================

-- Zeige was gelöscht wird (Verifikation VORHER)
SELECT 
    'Vorher - Jobs' as "Typ",
    COUNT(*) as "Anzahl"
FROM "Job" 
WHERE "createdAt"::DATE < '2025-10-28'
UNION ALL
SELECT 
    'Vorher - Chats' as "Typ",
    COUNT(*) as "Anzahl"
FROM "Chat" 
WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28')
UNION ALL
SELECT 
    'Vorher - Interests' as "Typ",
    COUNT(*) as "Anzahl"
FROM "Interest" 
WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28')
UNION ALL
SELECT 
    'Vorher - Messages' as "Typ",
    COUNT(*) as "Anzahl"
FROM "Message" 
WHERE "chatId" IN (SELECT id FROM "Chat" WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28'));

-- 1. Lösche Messages von Chats, die zu alten Jobs gehören
DELETE FROM "Message" 
WHERE "chatId" IN (
    SELECT id FROM "Chat" 
    WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28')
);

-- 2. Lösche Chats, die zu alten Jobs gehören
DELETE FROM "Chat" 
WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28');

-- 3. Lösche Interests, die zu alten Jobs gehören
DELETE FROM "Interest" 
WHERE "jobId" IN (SELECT id FROM "Job" WHERE "createdAt"::DATE < '2025-10-28');

-- 4. Lösche alte Jobs
DELETE FROM "Job" 
WHERE "createdAt"::DATE < '2025-10-28';

-- Verifikation: Zeige verbleibende Jobs nach dem Cleanup
SELECT 
    COUNT(*) as "Verbleibende Jobs",
    MIN("createdAt"::DATE) as "Ältester Job",
    MAX("createdAt"::DATE) as "Neuester Job"
FROM "Job";

-- Zeige alle verbleibenden Jobs (zur Kontrolle)
SELECT 
    j.title as "Stelle",
    c.name as "Firma",
    j."createdAt"::DATE as "Erstellt am"
FROM "Job" j
INNER JOIN "Company" c ON c.id = j."companyId"
ORDER BY j."createdAt" DESC
LIMIT 20;

