-- ============================================
-- Zusätzliche Stellen für Demo-Firma
-- Fügt 4 weitere Stellen zur bestehenden Demo-Firma hinzu:
-- - 3 Mid-Level-Stellen (3-5 Jahre Erfahrung)
-- - 1 Praktikumsstelle (0 Jahre Erfahrung)
-- ============================================
-- 
-- Voraussetzung: Die Demo-Firma muss bereits existieren
-- Email: demo@kassel-engineering.de
--
-- Ausführung: Kopiere dieses Script in den Supabase SQL Editor und führe es aus
-- ============================================

DO $$
DECLARE
    company_id TEXT;
BEGIN
    -- Finde die Demo-Firma
    SELECT id INTO company_id FROM "Company" WHERE email = 'demo@kassel-engineering.de';
    
    IF company_id IS NULL THEN
        RAISE EXCEPTION 'Demo-Firma nicht gefunden! Bitte zuerst create-demo-company.sql ausführen.';
    END IF;
    
    RAISE NOTICE 'Firma gefunden mit ID: %', company_id;
    
    -- Stelle 1: Entwicklungsingenieur Maschinenbau (Mid-Level)
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Entwicklungsingenieur Maschinenbau (m/w/d)'
    ) THEN
        INSERT INTO "Job" (
            id,
            title,
            description,
            "requiredSkills",
            location,
            "minExperience",
            "requiredEducation",
            "jobType",
            industry,
            hierarchy,
            autonomy,
            teamwork,
            "workStructure",
            feedback,
            flexibility,
            "companyId",
            "createdAt",
            "updatedAt"
        ) VALUES (
            gen_random_uuid()::TEXT,
            'Entwicklungsingenieur Maschinenbau (m/w/d)',
            'Du entwickelst eigenverantwortlich komplexe Maschinenkomponenten und führst Berechnungen durch. Du betreust Projekte von der Konzeption bis zur Serienreife und arbeitest eng mit Kunden und internen Teams zusammen. Wir bieten dir viel Gestaltungsspielraum, regelmäßiges Feedback und die Möglichkeit, innovative Lösungen zu entwickeln.',
            '["CAD (SolidWorks/CATIA)", "Maschinenelemente", "Konstruktion", "FEM-Analyse", "Projektmanagement", "Simulation", "Produktentwicklung"]'::JSONB,
            'Kassel',
            3,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            3, -- much
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Stelle 1 erstellt: Entwicklungsingenieur Maschinenbau (Mid-Level)';
    ELSE
        RAISE NOTICE '⚠️ Stelle 1 existiert bereits: Entwicklungsingenieur Maschinenbau';
    END IF;
    
    -- Stelle 2: Projektmanager Wirtschaftsingenieurwesen (Mid-Level)
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Projektmanager Wirtschaftsingenieurwesen (m/w/d)'
    ) THEN
        INSERT INTO "Job" (
            id,
            title,
            description,
            "requiredSkills",
            location,
            "minExperience",
            "requiredEducation",
            "jobType",
            industry,
            hierarchy,
            autonomy,
            teamwork,
            "workStructure",
            feedback,
            flexibility,
            "companyId",
            "createdAt",
            "updatedAt"
        ) VALUES (
            gen_random_uuid()::TEXT,
            'Projektmanager Wirtschaftsingenieurwesen (m/w/d)',
            'Du leitest eigenverantwortlich Entwicklungsprojekte und bist verantwortlich für Budget, Zeitplan und Qualität. Du koordinierst interdisziplinäre Teams, kommunizierst mit Kunden und entwickelst innovative Lösungen an der Schnittstelle zwischen Technik und Wirtschaft. Wir bieten dir viel Verantwortung, regelmäßiges Feedback und die Möglichkeit, deine Führungskompetenzen auszubauen.',
            '["Projektmanagement", "MS Project", "Kostenrechnung", "Excel", "Kommunikation", "Agile Methoden", "Risikomanagement", "Kundenbetreuung"]'::JSONB,
            'Kassel',
            4,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            3, -- much
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Stelle 2 erstellt: Projektmanager Wirtschaftsingenieurwesen (Mid-Level)';
    ELSE
        RAISE NOTICE '⚠️ Stelle 2 existiert bereits: Projektmanager Wirtschaftsingenieurwesen';
    END IF;
    
    -- Stelle 3: Controller / Business Analyst (Mid-Level)
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Controller / Business Analyst (m/w/d)'
    ) THEN
        INSERT INTO "Job" (
            id,
            title,
            description,
            "requiredSkills",
            location,
            "minExperience",
            "requiredEducation",
            "jobType",
            industry,
            hierarchy,
            autonomy,
            teamwork,
            "workStructure",
            feedback,
            flexibility,
            "companyId",
            "createdAt",
            "updatedAt"
        ) VALUES (
            gen_random_uuid()::TEXT,
            'Controller / Business Analyst (m/w/d)',
            'Du analysierst eigenverantwortlich Geschäftskennzahlen, erstellst Budgets und entwickelst Controlling-Instrumente. Du berätst die Geschäftsführung bei strategischen Entscheidungen und optimierst Geschäftsprozesse. Wir bieten dir viel Gestaltungsspielraum, regelmäßiges Feedback und die Möglichkeit, deine analytischen Fähigkeiten weiterzuentwickeln.',
            '["Excel", "SAP", "Controlling", "Finanzanalyse", "Reporting", "Business Intelligence", "Prozessoptimierung", "Power BI"]'::JSONB,
            'Kassel',
            5,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            3, -- much
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Stelle 3 erstellt: Controller / Business Analyst (Mid-Level)';
    ELSE
        RAISE NOTICE '⚠️ Stelle 3 existiert bereits: Controller / Business Analyst';
    END IF;
    
    -- Stelle 4: Praktikum Engineering & Projektmanagement
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Praktikum Engineering & Projektmanagement (m/w/d)'
    ) THEN
        INSERT INTO "Job" (
            id,
            title,
            description,
            "requiredSkills",
            location,
            "minExperience",
            "requiredEducation",
            "jobType",
            industry,
            hierarchy,
            autonomy,
            teamwork,
            "workStructure",
            feedback,
            flexibility,
            "companyId",
            "createdAt",
            "updatedAt"
        ) VALUES (
            gen_random_uuid()::TEXT,
            'Praktikum Engineering & Projektmanagement (m/w/d)',
            'Du unterstützt unser Team bei spannenden Projekten und lernst die praktische Anwendung deines Studiums kennen. Du arbeitest an realen Aufgaben mit, erhältst Einblicke in verschiedene Abteilungen und wirst von erfahrenen Kollegen betreut. Wir bieten dir eine strukturierte Einarbeitung, regelmäßiges Feedback und die Möglichkeit, erste Berufserfahrung zu sammeln.',
            '["Grundkenntnisse CAD", "MS Office", "Teamfähigkeit", "Lernbereitschaft", "Kommunikation"]'::JSONB,
            'Kassel',
            0,
            'Abitur',
            'Praktikum',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            1, -- very_little (Praktikum = mehr Anleitung)
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Stelle 4 erstellt: Praktikum Engineering & Projektmanagement';
    ELSE
        RAISE NOTICE '⚠️ Stelle 4 existiert bereits: Praktikum Engineering & Projektmanagement';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Alle neuen Stellen erfolgreich hinzugefügt!';
END $$;

-- Verifikation: Zeige alle Stellen der Demo-Firma
SELECT 
    j.title as "Stelle",
    j."jobType" as "Typ",
    j."minExperience" as "Min. Erfahrung (Jahre)",
    j."requiredEducation" as "Bildung"
FROM "Job" j
INNER JOIN "Company" c ON c.id = j."companyId"
WHERE c.email = 'demo@kassel-engineering.de'
ORDER BY j."minExperience", j."createdAt";



