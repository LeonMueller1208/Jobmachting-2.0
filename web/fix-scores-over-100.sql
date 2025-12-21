-- ============================================
-- Fix: Setze alle Match-Scores über 100% auf 100%
-- ============================================
-- 
-- Dieses Script korrigiert alle Scores in der Interest-Tabelle,
-- die über 100% sind (durch alten Bug entstanden)
--
-- Ausführung: Kopiere dieses Script in den Supabase SQL Editor und führe es aus
-- ============================================

-- Zeige betroffene Einträge VORHER
SELECT 
    COUNT(*) as "Interests mit Score > 100%",
    MAX("matchScore") as "Höchster Score",
    MIN("matchScore") as "Niedrigster Score > 100"
FROM "Interest"
WHERE "matchScore" > 100;

-- Update: Setze alle Scores über 100% auf 100%
UPDATE "Interest"
SET "matchScore" = 100.0
WHERE "matchScore" > 100;

-- Verifikation: Zeige Ergebnis NACHHER
SELECT 
    COUNT(*) as "Verbleibende Interests mit Score > 100%",
    MAX("matchScore") as "Höchster Score",
    COUNT(*) FILTER (WHERE "matchScore" > 100) as "Noch vorhandene Scores > 100"
FROM "Interest";

