--
-- 🌱 SEED SCRIPT: Frankfurt Demo-Daten (SQL Version)
-- 
-- Erstellt 5 realistische Firmen mit passenden Jobs in Frankfurt
-- für MVP-Testing und Feedback-Runden.
--
-- Verwendung: Kopiere dieses Script und führe es im Supabase SQL Editor aus
--

-- 1️⃣ TechVision GmbH - IT Startup
INSERT INTO "Company" (id, name, email, industry, location, "createdAt", "updatedAt")
VALUES 
  ('demo-techvision-001', 'TechVision GmbH', 'demo-techvision@jobmatching.de', 'IT & Software', 'Frankfurt', NOW(), NOW());

INSERT INTO "Job" (id, title, description, "requiredSkills", location, "minExperience", "requiredEducation", "jobType", "companyId", industry, "createdAt", "updatedAt")
VALUES
  ('demo-job-tech-001', 'Junior Frontend Developer', 
   'TechVision GmbH sucht einen motivierten Junior Frontend Developer!

Deine Aufgaben:
• Entwicklung moderner Web-Anwendungen mit React und TypeScript
• Enge Zusammenarbeit mit unserem Design-Team
• Code Reviews und Pair Programming
• Teilnahme an agilen Sprints

Was wir bieten:
• Mentoring durch Senior Developers
• Moderne Tech-Stack (React, Next.js, Tailwind)
• Flexible Arbeitszeiten und Homeoffice-Möglichkeit
• Weiterbildungsbudget von 2.000€/Jahr
• Startup-Atmosphäre mit flachen Hierarchien

Bewirb dich jetzt und werde Teil unseres Teams!',
   '["JavaScript", "React", "HTML/CSS", "Git"]',
   'Frankfurt', 1, 'Bachelor', 'Vollzeit', 'demo-techvision-001', 'IT & Software', NOW(), NOW()),
   
  ('demo-job-tech-002', 'Senior Full Stack Developer',
   'TechVision sucht einen erfahrenen Senior Full Stack Developer!

Deine Verantwortung:
• Architektur und Entwicklung skalierbarer Web-Anwendungen
• Technische Führung und Mentoring von Junior Developern
• Integration von APIs und Microservices
• Performance-Optimierung und Best Practices

Tech Stack:
• Frontend: React, Next.js, TypeScript, Tailwind CSS
• Backend: Node.js, PostgreSQL, Prisma
• Cloud: AWS, Docker, CI/CD

Was wir bieten:
• 70.000-85.000€ Jahresgehalt
• Equity-Beteiligung am Startup
• Moderne Hardware (MacBook Pro, 4K-Monitors)
• 30 Tage Urlaub + flexible Arbeitszeiten
• Remote-First Kultur

Gestalte die Zukunft mit uns!',
   '["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"]',
   'Frankfurt', 5, 'Bachelor', 'Vollzeit', 'demo-techvision-001', 'IT & Software', NOW(), NOW()),
   
  ('demo-job-tech-003', 'UI/UX Designer',
   'Wir suchen einen kreativen UI/UX Designer für unsere Produktteams!

Deine Aufgaben:
• Design moderner und intuitiver User Interfaces
• Erstellung von Wireframes, Prototypes und Design Systems
• User Research und Usability Testing
• Enge Zusammenarbeit mit Product und Engineering

Tools:
• Figma, Adobe XD, Sketch
• Prototyping mit Framer, InVision
• Design Systems und Component Libraries

Was wir bieten:
• Kreative Freiheit und Gestaltungsspielraum
• Modernes Design-Setup und Tools
• Internationales Team mit viel Erfahrung
• Weiterbildung und Konferenz-Besuche
• 60.000-70.000€ Jahresgehalt

Zeig uns dein Portfolio!',
   '["Figma", "UI/UX Design", "Prototyping", "User Research"]',
   'Frankfurt', 3, 'Bachelor', 'Vollzeit', 'demo-techvision-001', 'IT & Software', NOW(), NOW());

-- 2️⃣ FinanzPro AG - Finanzdienstleister
INSERT INTO "Company" (id, name, email, industry, location, "createdAt", "updatedAt")
VALUES 
  ('demo-finanzpro-001', 'FinanzPro AG', 'demo-finanzpro@jobmatching.de', 'Finanzwesen', 'Frankfurt', NOW(), NOW());

INSERT INTO "Job" (id, title, description, "requiredSkills", location, "minExperience", "requiredEducation", "jobType", "companyId", industry, "createdAt", "updatedAt")
VALUES
  ('demo-job-fin-001', 'Junior Finanzberater (m/w/d)',
   'FinanzPro AG sucht motivierte Junior Finanzberater für unser Frankfurter Büro!

Deine Aufgaben:
• Beratung von Privatkunden in Finanzfragen
• Analyse individueller Finanzsituationen
• Erstellung von Anlagestrategien
• Aufbau eines eigenen Kundenstamms

Dein Profil:
• Abgeschlossenes Studium (BWL, Finance, o.ä.)
• Kommunikationsstärke und Kundenorientierung
• Interesse an Finanzmärkten
• Erste Praktika im Finanzbereich von Vorteil

Was wir bieten:
• Strukturiertes Traineeprogramm (12 Monate)
• Attraktive Provisionen zusätzlich zum Fixgehalt
• Mentoring durch erfahrene Berater
• Moderne Büroräume in Frankfurt City
• 48.000€ Einstiegsgehalt + Bonussystem

Starte deine Karriere im Finanzwesen!',
   '["Kundenberatung", "Finanzanalyse", "Kommunikation", "MS Office"]',
   'Frankfurt', 0, 'Bachelor', 'Vollzeit', 'demo-finanzpro-001', 'Finanzwesen', NOW(), NOW()),
   
  ('demo-job-fin-002', 'Senior Risk Manager (m/w/d)',
   'FinanzPro AG sucht einen erfahrenen Senior Risk Manager!

Deine Verantwortung:
• Entwicklung und Implementierung von Risikomanagement-Strategien
• Überwachung von Markt-, Kredit- und operationellen Risiken
• Erstellung von Risikoreports für das Management
• Sicherstellung regulatorischer Compliance (BaFin, MiFID II)
• Führung eines Teams von 3-4 Risk Analysten

Anforderungen:
• Abgeschlossenes Studium (Finance, VWL, Mathematik)
• Mind. 5 Jahre Erfahrung im Risikomanagement
• Sehr gute Kenntnisse in Basel III/IV, MaRisk
• Erfahrung mit Risiko-Tools (Bloomberg, Moody''s Analytics)
• Analytisches Denken und Führungserfahrung

Was wir bieten:
• 80.000-95.000€ Jahresgehalt + Bonus
• Verantwortungsvolle Position mit Gestaltungsspielraum
• Weiterbildung (CFA, FRM)
• Zentrale Lage direkt am Frankfurter Hauptbahnhof
• Betriebliche Altersvorsorge

Bewirb dich jetzt!',
   '["Risikomanagement", "Finanzanalyse", "Compliance", "Führungserfahrung", "Excel", "Bloomberg"]',
   'Frankfurt', 5, 'Master', 'Vollzeit', 'demo-finanzpro-001', 'Finanzwesen', NOW(), NOW());

-- 3️⃣ MediCare Plus - Gesundheitswesen
INSERT INTO "Company" (id, name, email, industry, location, "createdAt", "updatedAt")
VALUES 
  ('demo-medicare-001', 'MediCare Plus', 'demo-medicare@jobmatching.de', 'Gesundheitswesen', 'Frankfurt', NOW(), NOW());

INSERT INTO "Job" (id, title, description, "requiredSkills", location, "minExperience", "requiredEducation", "jobType", "companyId", industry, "createdAt", "updatedAt")
VALUES
  ('demo-job-med-001', 'Gesundheits- und Krankenpfleger (m/w/d)',
   'MediCare Plus sucht engagierte Pflegefachkräfte für unsere Klinik!

Deine Aufgaben:
• Ganzheitliche Pflege und Betreuung unserer Patienten
• Durchführung ärztlicher Anordnungen
• Dokumentation und Pflegeplanung
• Anleitung von Auszubildenden
• Zusammenarbeit im interdisziplinären Team

Dein Profil:
• Abgeschlossene Ausbildung als Gesundheits- und Krankenpfleger/in
• Einfühlungsvermögen und Teamfähigkeit
• Belastbarkeit und Organisationstalent
• Bereitschaft zum Schichtdienst

Was wir bieten:
• 3.800-4.200€ Bruttogehalt (abhängig von Erfahrung)
• Schichtzulagen und Weihnachtsgeld
• 30 Tage Urlaub
• Interne und externe Fortbildungen
• Betriebliche Altersvorsorge
• Moderne Arbeitsausstattung
• Gute Verkehrsanbindung

Bewirb dich jetzt und werde Teil unseres Teams!',
   '["Krankenpflege", "Patientenbetreuung", "Medizinische Dokumentation", "Teamarbeit"]',
   'Frankfurt', 2, 'Ausbildung', 'Vollzeit', 'demo-medicare-001', 'Gesundheitswesen', NOW(), NOW()),
   
  ('demo-job-med-002', 'Medizinische Fachangestellte (m/w/d)',
   'MediCare Plus sucht MFA für unsere Facharztpraxen!

Deine Aufgaben:
• Patientenempfang und -betreuung
• Terminvergabe und -koordination
• Assistenz bei Untersuchungen und Behandlungen
• Blutentnahmen und EKG
• Verwaltung von Patientenakten

Dein Profil:
• Abgeschlossene Ausbildung als MFA
• Freundliches und professionelles Auftreten
• Organisationsgeschick und Zuverlässigkeit
• Sicherer Umgang mit Praxissoftware

Was wir bieten:
• 2.800-3.200€ Bruttogehalt
• Geregelte Arbeitszeiten (Mo-Fr, kein Schichtdienst)
• Angenehmes Arbeitsklima
• Fort- und Weiterbildungsmöglichkeiten
• Betriebliche Altersvorsorge
• Zentrale Lage mit guter Anbindung

Wir freuen uns auf deine Bewerbung!',
   '["Patientenbetreuung", "Medizinische Assistenz", "Praxissoftware", "Organisation"]',
   'Frankfurt', 1, 'Ausbildung', 'Vollzeit', 'demo-medicare-001', 'Gesundheitswesen', NOW(), NOW()),
   
  ('demo-job-med-003', 'Physiotherapeut (m/w/d)',
   'MediCare Plus sucht qualifizierte Physiotherapeuten!

Deine Aufgaben:
• Durchführung physiotherapeutischer Behandlungen
• Erstellung individueller Therapiepläne
• Manuelle Therapie und Krankengymnastik
• Dokumentation der Behandlungsfortschritte
• Beratung von Patienten

Dein Profil:
• Staatlich anerkannte Ausbildung als Physiotherapeut/in
• Zusatzqualifikationen (z.B. Manuelle Therapie) von Vorteil
• Einfühlungsvermögen und Kommunikationsstärke
• Teamorientierte Arbeitsweise

Was wir bieten:
• 3.200-3.800€ Bruttogehalt
• Geregelte Arbeitszeiten
• Moderne Praxisausstattung
• Unterstützung bei Fortbildungen
• Angenehmes Arbeitsumfeld
• Entwicklungsmöglichkeiten

Bewirb dich jetzt!',
   '["Physiotherapie", "Manuelle Therapie", "Krankengymnastik", "Patientenbetreuung"]',
   'Frankfurt', 1, 'Ausbildung', 'Vollzeit', 'demo-medicare-001', 'Gesundheitswesen', NOW(), NOW());

-- 4️⃣ LogiFlow Solutions - Logistik
INSERT INTO "Company" (id, name, email, industry, location, "createdAt", "updatedAt")
VALUES 
  ('demo-logiflow-001', 'LogiFlow Solutions', 'demo-logiflow@jobmatching.de', 'Logistik', 'Frankfurt', NOW(), NOW());

INSERT INTO "Job" (id, title, description, "requiredSkills", location, "minExperience", "requiredEducation", "jobType", "companyId", industry, "createdAt", "updatedAt")
VALUES
  ('demo-job-log-001', 'Supply Chain Manager (m/w/d)',
   'LogiFlow Solutions sucht einen Supply Chain Manager!

Deine Aufgaben:
• Optimierung der gesamten Lieferkette
• Lieferantenmanagement und Verhandlungen
• Bestandsmanagement und Disposition
• Implementierung von Logistik-Software (SAP, WMS)
• Kennzahlenanalyse und Reporting
• Führung eines Teams von 5 Mitarbeitern

Anforderungen:
• Studium in Logistik, BWL oder vergleichbar
• Mind. 3 Jahre Erfahrung im Supply Chain Management
• Sehr gute SAP-Kenntnisse (MM, SD)
• Analytisches Denken und Problemlösungskompetenz
• Verhandlungssichere Englischkenntnisse

Was wir bieten:
• 55.000-65.000€ Jahresgehalt
• Verantwortungsvolle Position mit Gestaltungsspielraum
• Moderne Logistik-Systeme und Digitalisierung
• Firmenwagen (auch zur privaten Nutzung)
• 30 Tage Urlaub + flexible Arbeitszeiten
• Weiterbildungsmöglichkeiten

Bewirb dich jetzt!',
   '["Supply Chain Management", "SAP", "Logistik", "Verhandlung", "Führungserfahrung", "Englisch"]',
   'Frankfurt', 3, 'Bachelor', 'Vollzeit', 'demo-logiflow-001', 'Logistik', NOW(), NOW()),
   
  ('demo-job-log-002', 'Lagerleiter (m/w/d)',
   'LogiFlow Solutions sucht einen erfahrenen Lagerleiter!

Deine Aufgaben:
• Leitung und Organisation des Lagerbetriebs
• Führung von 15-20 Lagermitarbeitern
• Optimierung von Lager- und Kommissionierprozessen
• Sicherstellung der Arbeitssicherheit
• Bestandskontrollen und Inventuren
• Schnittstelle zu Disposition und Versand

Anforderungen:
• Ausbildung als Fachkraft für Lagerlogistik oder vergleichbar
• Mind. 3 Jahre Führungserfahrung im Lagerbereich
• Kenntnisse in Lagerverwaltungssystemen
• Staplerschein und Arbeitssicherheitsschulungen
• Durchsetzungsvermögen und Organisationstalent

Was wir bieten:
• 45.000-52.000€ Jahresgehalt
• Verantwortungsvolle Führungsposition
• Modernes Logistikzentrum
• Weiterbildung und Schulungen
• Betriebliche Altersvorsorge
• Gute Verkehrsanbindung

Werde Teil unseres Teams!',
   '["Lagerverwaltung", "Führungserfahrung", "Logistik", "Arbeitssicherheit", "Organisation"]',
   'Frankfurt', 3, 'Ausbildung', 'Vollzeit', 'demo-logiflow-001', 'Logistik', NOW(), NOW());

-- 5️⃣ GreenEnergy GmbH - Energie & Umwelt
INSERT INTO "Company" (id, name, email, industry, location, "createdAt", "updatedAt")
VALUES 
  ('demo-greenenergy-001', 'GreenEnergy GmbH', 'demo-greenenergy@jobmatching.de', 'Energie', 'Frankfurt', NOW(), NOW());

INSERT INTO "Job" (id, title, description, "requiredSkills", location, "minExperience", "requiredEducation", "jobType", "companyId", industry, "createdAt", "updatedAt")
VALUES
  ('demo-job-green-001', 'Projektmanager Erneuerbare Energien (m/w/d)',
   'GreenEnergy GmbH sucht einen Projektmanager für nachhaltige Energieprojekte!

Deine Aufgaben:
• Planung und Steuerung von Solar- und Windenergieprojekten
• Koordination von internen und externen Stakeholdern
• Budget- und Terminverantwortung
• Genehmigungsverfahren und Behördenkommunikation
• Technische und kaufmännische Projektüberwachung

Anforderungen:
• Studium im Bereich Energietechnik, Umwelttechnik oder vergleichbar
• Mind. 2 Jahre Erfahrung im Projektmanagement (idealerweise Renewables)
• Kenntnisse in EEG, Genehmigungsverfahren
• Projektmanagement-Tools (MS Project, Jira)
• Reisebereitschaft (ca. 20%)

Was wir bieten:
• 55.000-68.000€ Jahresgehalt
• Sinnstiftende Arbeit für die Energiewende
• Moderne Büros und flexible Arbeitszeiten
• Homeoffice-Möglichkeiten (2-3 Tage/Woche)
• Weiterbildungsbudget und Zertifizierungen
• JobRad und betriebliche Altersvorsorge

Gestalte die Zukunft mit uns!',
   '["Projektmanagement", "Erneuerbare Energien", "Genehmigungsverfahren", "Stakeholder Management"]',
   'Frankfurt', 2, 'Bachelor', 'Vollzeit', 'demo-greenenergy-001', 'Energie', NOW(), NOW()),
   
  ('demo-job-green-002', 'Elektroingenieur Photovoltaik (m/w/d)',
   'GreenEnergy GmbH sucht einen Elektroingenieur für PV-Anlagen!

Deine Aufgaben:
• Planung und Auslegung von Photovoltaik-Anlagen
• Erstellung von Elektro-Konzepten und Schaltplänen
• Technische Begleitung von Bauprojekten
• Inbetriebnahme und Testing
• Technischer Support für Vertrieb und Kunden

Anforderungen:
• Abgeschlossenes Studium Elektrotechnik oder vergleichbar
• Kenntnisse in PV-Technik, Wechselrichtern, Speichersystemen
• Erfahrung mit CAD-Software (AutoCAD, EPLAN)
• Kenntnisse in VDE-Normen und Netzanschluss
• Führerschein Klasse B

Was wir bieten:
• 52.000-62.000€ Jahresgehalt
• Spannende Projekte im Bereich Solar
• Firmenwagen bei Außeneinsätzen
• Moderne technische Ausstattung
• Weiterbildung und Zertifizierungen
• Flexible Arbeitszeiten

Werde Teil der Energiewende!',
   '["Elektrotechnik", "Photovoltaik", "CAD", "Projektplanung", "VDE-Normen"]',
   'Frankfurt', 2, 'Bachelor', 'Vollzeit', 'demo-greenenergy-001', 'Energie', NOW(), NOW()),
   
  ('demo-job-green-003', 'Kaufmännischer Mitarbeiter Energiewirtschaft (m/w/d)',
   'GreenEnergy GmbH sucht kaufmännische Unterstützung!

Deine Aufgaben:
• Angebotserstellung und Vertragsmanagement
• Rechnungsprüfung und Buchhaltung
• Kommunikation mit Kunden und Lieferanten
• Unterstützung im Projektcontrolling
• Allgemeine Verwaltungsaufgaben

Anforderungen:
• Kaufmännische Ausbildung oder Studium (BWL)
• Erste Erfahrung in der Energiebranche von Vorteil
• Sehr gute MS Office Kenntnisse (Excel!)
• Organisationstalent und Kommunikationsstärke
• Affinität zu Nachhaltigkeit und Umwelt

Was wir bieten:
• 38.000-45.000€ Jahresgehalt
• Vielseitige Aufgaben in wachsendem Unternehmen
• Moderne Büros und angenehmes Arbeitsklima
• Homeoffice-Option (1-2 Tage/Woche)
• Weiterbildungsmöglichkeiten
• Jobticket und Kaffee/Getränke flat

Bewirb dich jetzt!',
   '["Kaufmännische Tätigkeiten", "MS Office", "Vertragsmanagement", "Buchhaltung", "Kommunikation"]',
   'Frankfurt', 1, 'Ausbildung', 'Vollzeit', 'demo-greenenergy-001', 'Energie', NOW(), NOW());

-- ✅ SEEDING ABGESCHLOSSEN
-- 5 Firmen und 13 Jobs erstellt - alle in Frankfurt 🏙️

