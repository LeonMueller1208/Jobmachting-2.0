-- ============================================
-- Demo-Firma: Kassel Engineering Solutions GmbH
-- Erstellt eine Demo-Firma mit 3 Junior-Stellen
-- für Wirtschaftler und Ingenieure
-- ============================================
-- 
-- Login-Daten:
-- Email: demo@kassel-engineering.de
-- Passwort: demo123
--
-- Ausführung: Kopiere dieses Script in den Supabase SQL Editor und führe es aus
-- ============================================

-- Passwort-Hash für "demo123" (bcrypt mit 10 rounds)
-- Falls das nicht funktioniert, kann das Passwort auch über die App geändert werden
DO $$
DECLARE
    company_id TEXT;
    -- bcrypt hash für "demo123" (generiert mit bcryptjs, 10 rounds)
    password_hash TEXT := '$2b$10$.EDZBlug7jTGWJCHLDrcrOCtRssLxmE7nN9p6wEgkxoR.OlZZZ1.C';
BEGIN
    -- Prüfe ob Firma bereits existiert
    SELECT id INTO company_id FROM "Company" WHERE email = 'demo@kassel-engineering.de';
    
    IF company_id IS NULL THEN
        -- Erstelle Firma
        INSERT INTO "Company" (
            id,
            name,
            email,
            "passwordHash",
            industry,
            location,
            description,
            website,
            "companySize",
            "foundedYear",
            "createdAt",
            "updatedAt"
        ) VALUES (
            gen_random_uuid()::TEXT,
            'Kassel Engineering Solutions GmbH',
            'demo@kassel-engineering.de',
            password_hash,
            'Maschinenbau & Engineering',
            'Kassel',
            'Wir sind ein mittelständisches Engineering-Unternehmen mit Sitz in Kassel und entwickeln innovative Lösungen für die Automobil- und Industrieautomation. Unser Team aus 45 Mitarbeitern verbindet technische Expertise mit wirtschaftlichem Know-how. Wir bieten eine strukturierte Arbeitsumgebung mit klaren Verantwortlichkeiten, eigenverantwortlichem Arbeiten und regelmäßigem Feedback. Teamarbeit ist bei uns essentiell und wir schätzen flexible Arbeitszeiten für eine gute Work-Life-Balance.',
            'https://www.kassel-engineering.de',
            '51-200',
            2015,
            NOW(),
            NOW()
        ) RETURNING id INTO company_id;
        
        RAISE NOTICE 'Firma erstellt mit ID: %', company_id;
    ELSE
        RAISE NOTICE 'Firma existiert bereits mit ID: %', company_id;
    END IF;
    
    -- Stelle 1: Junior Entwicklungsingenieur Maschinenbau
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Junior Entwicklungsingenieur Maschinenbau (m/w/d)'
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
            'Junior Entwicklungsingenieur Maschinenbau (m/w/d)',
            'Du unterstützt unser Entwicklungsteam bei der Konstruktion und Entwicklung von Maschinenkomponenten für die Industrieautomation. Du lernst CAD-Software, Berechnungsmethoden und Entwicklungsprozesse kennen. Wir bieten dir eine strukturierte Einarbeitung, regelmäßiges Feedback von erfahrenen Kollegen und die Möglichkeit, an spannenden Projekten mitzuwirken.',
            '["CAD (SolidWorks/CATIA)", "Maschinenelemente", "Konstruktion", "FEM-Analyse", "Projektmanagement"]'::JSONB,
            'Kassel',
            0,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            2, -- some
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Stelle 1 erstellt: Junior Entwicklungsingenieur Maschinenbau';
    ELSE
        RAISE NOTICE 'Stelle 1 existiert bereits: Junior Entwicklungsingenieur Maschinenbau';
    END IF;
    
    -- Stelle 2: Junior Wirtschaftsingenieur Projektmanagement
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Junior Wirtschaftsingenieur Projektmanagement (m/w/d)'
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
            'Junior Wirtschaftsingenieur Projektmanagement (m/w/d)',
            'Du unterstützt unser Projektmanagement-Team bei der Planung und Steuerung von Entwicklungsprojekten. Du lernst Projektmanagement-Methoden, Kostenkalkulation und Kundenkommunikation kennen. Wir bieten dir eigenverantwortliches Arbeiten an Teilprojekten, regelmäßiges Feedback und die Möglichkeit, deine wirtschaftliche und technische Expertise zu kombinieren.',
            '["Projektmanagement", "MS Project", "Kostenrechnung", "Excel", "Kommunikation"]'::JSONB,
            'Kassel',
            0,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            2, -- some
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Stelle 2 erstellt: Junior Wirtschaftsingenieur Projektmanagement';
    ELSE
        RAISE NOTICE 'Stelle 2 existiert bereits: Junior Wirtschaftsingenieur Projektmanagement';
    END IF;
    
    -- Stelle 3: Junior Controller / Business Analyst
    IF NOT EXISTS (
        SELECT 1 FROM "Job" 
        WHERE "companyId" = company_id 
        AND title = 'Junior Controller / Business Analyst (m/w/d)'
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
            'Junior Controller / Business Analyst (m/w/d)',
            'Du unterstützt unser Controlling-Team bei der Analyse von Geschäftskennzahlen, Budgetplanung und Kostenkontrolle. Du lernst Reporting-Tools, Finanzanalyse und Business Intelligence kennen. Wir bieten dir strukturierte Arbeitsabläufe, regelmäßiges Feedback und die Möglichkeit, Einblicke in die Geschäftsprozesse eines Engineering-Unternehmens zu erhalten.',
            '["Excel", "SAP", "Controlling", "Finanzanalyse", "Reporting"]'::JSONB,
            'Kassel',
            1,
            'Bachelor',
            'Vollzeit',
            'Maschinenbau & Engineering',
            3, -- rather_clear
            2, -- some
            2, -- important
            4,
            4,
            2, -- important
            company_id,
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Stelle 3 erstellt: Junior Controller / Business Analyst';
    ELSE
        RAISE NOTICE 'Stelle 3 existiert bereits: Junior Controller / Business Analyst';
    END IF;
    
    RAISE NOTICE '✅ Demo-Firma und Stellen erfolgreich erstellt!';
    RAISE NOTICE '📧 Login: demo@kassel-engineering.de';
    RAISE NOTICE '🔑 Passwort: demo123';
END $$;

-- Verifikation: Zeige erstellte Daten
SELECT 
    c.name as "Firma",
    c.email as "Email",
    c.location as "Standort",
    COUNT(j.id) as "Anzahl Stellen"
FROM "Company" c
LEFT JOIN "Job" j ON j."companyId" = c.id
WHERE c.email = 'demo@kassel-engineering.de'
GROUP BY c.id, c.name, c.email, c.location;

SELECT 
    j.title as "Stelle",
    j.location as "Standort",
    j."minExperience" as "Min. Erfahrung",
    j."requiredEducation" as "Bildung"
FROM "Job" j
INNER JOIN "Company" c ON c.id = j."companyId"
WHERE c.email = 'demo@kassel-engineering.de'
ORDER BY j."createdAt";

