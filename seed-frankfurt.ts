/**
 * 🌱 SEED SCRIPT: Frankfurt Demo-Daten
 * 
 * Erstellt 5 realistische Firmen mit passenden Jobs in Frankfurt
 * für MVP-Testing und Feedback-Runden.
 * 
 * Run: npx tsx seed-frankfurt.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starte Seeding für Frankfurt...\n');

  // ============================================
  // 1️⃣ TechVision GmbH - IT Startup
  // ============================================
  console.log('📦 Erstelle TechVision GmbH...');
  const techVision = await prisma.company.create({
    data: {
      name: 'TechVision GmbH',
      email: 'demo-techvision@jobmatching.de',
      industry: 'IT & Software',
      location: 'Frankfurt',
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: techVision.id,
        title: 'Junior Frontend Developer',
        description: `TechVision GmbH sucht einen motivierten Junior Frontend Developer!

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

Bewirb dich jetzt und werde Teil unseres Teams!`,
        requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
        minExperience: 1,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'IT & Software',
      },
      {
        companyId: techVision.id,
        title: 'Senior Full Stack Developer',
        description: `TechVision sucht einen erfahrenen Senior Full Stack Developer!

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

Gestalte die Zukunft mit uns!`,
        requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        minExperience: 5,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'IT & Software',
      },
      {
        companyId: techVision.id,
        title: 'UI/UX Designer',
        description: `Wir suchen einen kreativen UI/UX Designer für unsere Produktteams!

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

Zeig uns dein Portfolio!`,
        requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
        minExperience: 3,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'IT & Software',
      },
    ],
  });
  console.log('✅ TechVision GmbH erstellt (3 Jobs)\n');

  // ============================================
  // 2️⃣ FinanzPro AG - Finanzdienstleister
  // ============================================
  console.log('📦 Erstelle FinanzPro AG...');
  const finanzPro = await prisma.company.create({
    data: {
      name: 'FinanzPro AG',
      email: 'demo-finanzpro@jobmatching.de',
      industry: 'Finanzwesen',
      location: 'Frankfurt',
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: finanzPro.id,
        title: 'Junior Finanzberater (m/w/d)',
        description: `FinanzPro AG sucht motivierte Junior Finanzberater für unser Frankfurter Büro!

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

Starte deine Karriere im Finanzwesen!`,
        requiredSkills: ['Kundenberatung', 'Finanzanalyse', 'Kommunikation', 'MS Office'],
        minExperience: 0,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Finanzwesen',
      },
      {
        companyId: finanzPro.id,
        title: 'Senior Risk Manager (m/w/d)',
        description: `FinanzPro AG sucht einen erfahrenen Senior Risk Manager!

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
• Erfahrung mit Risiko-Tools (Bloomberg, Moody's Analytics)
• Analytisches Denken und Führungserfahrung

Was wir bieten:
• 80.000-95.000€ Jahresgehalt + Bonus
• Verantwortungsvolle Position mit Gestaltungsspielraum
• Weiterbildung (CFA, FRM)
• Zentrale Lage direkt am Frankfurter Hauptbahnhof
• Betriebliche Altersvorsorge

Bewirb dich jetzt!`,
        requiredSkills: ['Risikomanagement', 'Finanzanalyse', 'Compliance', 'Führungserfahrung', 'Excel', 'Bloomberg'],
        minExperience: 5,
        requiredEducation: 'Master',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Finanzwesen',
      },
    ],
  });
  console.log('✅ FinanzPro AG erstellt (2 Jobs)\n');

  // ============================================
  // 3️⃣ MediCare Plus - Gesundheitswesen
  // ============================================
  console.log('📦 Erstelle MediCare Plus...');
  const mediCare = await prisma.company.create({
    data: {
      name: 'MediCare Plus',
      email: 'demo-medicare@jobmatching.de',
      industry: 'Gesundheitswesen',
      location: 'Frankfurt',
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: mediCare.id,
        title: 'Gesundheits- und Krankenpfleger (m/w/d)',
        description: `MediCare Plus sucht engagierte Pflegefachkräfte für unsere Klinik!

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

Bewirb dich jetzt und werde Teil unseres Teams!`,
        requiredSkills: ['Krankenpflege', 'Patientenbetreuung', 'Medizinische Dokumentation', 'Teamarbeit'],
        minExperience: 2,
        requiredEducation: 'Ausbildung',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Gesundheitswesen',
      },
      {
        companyId: mediCare.id,
        title: 'Medizinische Fachangestellte (m/w/d)',
        description: `MediCare Plus sucht MFA für unsere Facharztpraxen!

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

Wir freuen uns auf deine Bewerbung!`,
        requiredSkills: ['Patientenbetreuung', 'Medizinische Assistenz', 'Praxissoftware', 'Organisation'],
        minExperience: 1,
        requiredEducation: 'Ausbildung',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Gesundheitswesen',
      },
      {
        companyId: mediCare.id,
        title: 'Physiotherapeut (m/w/d)',
        description: `MediCare Plus sucht qualifizierte Physiotherapeuten!

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

Bewirb dich jetzt!`,
        requiredSkills: ['Physiotherapie', 'Manuelle Therapie', 'Krankengymnastik', 'Patientenbetreuung'],
        minExperience: 1,
        requiredEducation: 'Ausbildung',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Gesundheitswesen',
      },
    ],
  });
  console.log('✅ MediCare Plus erstellt (3 Jobs)\n');

  // ============================================
  // 4️⃣ LogiFlow Solutions - Logistik
  // ============================================
  console.log('📦 Erstelle LogiFlow Solutions...');
  const logiFlow = await prisma.company.create({
    data: {
      name: 'LogiFlow Solutions',
      email: 'demo-logiflow@jobmatching.de',
      industry: 'Logistik',
      location: 'Frankfurt',
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: logiFlow.id,
        title: 'Supply Chain Manager (m/w/d)',
        description: `LogiFlow Solutions sucht einen Supply Chain Manager!

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

Bewirb dich jetzt!`,
        requiredSkills: ['Supply Chain Management', 'SAP', 'Logistik', 'Verhandlung', 'Führungserfahrung', 'Englisch'],
        minExperience: 3,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Logistik',
      },
      {
        companyId: logiFlow.id,
        title: 'Lagerleiter (m/w/d)',
        description: `LogiFlow Solutions sucht einen erfahrenen Lagerleiter!

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

Werde Teil unseres Teams!`,
        requiredSkills: ['Lagerverwaltung', 'Führungserfahrung', 'Logistik', 'Arbeitssicherheit', 'Organisation'],
        minExperience: 3,
        requiredEducation: 'Ausbildung',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Logistik',
      },
    ],
  });
  console.log('✅ LogiFlow Solutions erstellt (2 Jobs)\n');

  // ============================================
  // 5️⃣ GreenEnergy GmbH - Energie & Umwelt
  // ============================================
  console.log('📦 Erstelle GreenEnergy GmbH...');
  const greenEnergy = await prisma.company.create({
    data: {
      name: 'GreenEnergy GmbH',
      email: 'demo-greenenergy@jobmatching.de',
      industry: 'Energie',
      location: 'Frankfurt',
    },
  });

  await prisma.job.createMany({
    data: [
      {
        companyId: greenEnergy.id,
        title: 'Projektmanager Erneuerbare Energien (m/w/d)',
        description: `GreenEnergy GmbH sucht einen Projektmanager für nachhaltige Energieprojekte!

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

Gestalte die Zukunft mit uns!`,
        requiredSkills: ['Projektmanagement', 'Erneuerbare Energien', 'Genehmigungsverfahren', 'Stakeholder Management'],
        minExperience: 2,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Energie',
      },
      {
        companyId: greenEnergy.id,
        title: 'Elektroingenieur Photovoltaik (m/w/d)',
        description: `GreenEnergy GmbH sucht einen Elektroingenieur für PV-Anlagen!

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

Werde Teil der Energiewende!`,
        requiredSkills: ['Elektrotechnik', 'Photovoltaik', 'CAD', 'Projektplanung', 'VDE-Normen'],
        minExperience: 2,
        requiredEducation: 'Bachelor',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Energie',
      },
      {
        companyId: greenEnergy.id,
        title: 'Kaufmännischer Mitarbeiter Energiewirtschaft (m/w/d)',
        description: `GreenEnergy GmbH sucht kaufmännische Unterstützung!

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

Bewirb dich jetzt!`,
        requiredSkills: ['Kaufmännische Tätigkeiten', 'MS Office', 'Vertragsmanagement', 'Buchhaltung', 'Kommunikation'],
        minExperience: 1,
        requiredEducation: 'Ausbildung',
        jobType: 'Vollzeit',
        location: 'Frankfurt',
        industry: 'Energie',
      },
    ],
  });
  console.log('✅ GreenEnergy GmbH erstellt (3 Jobs)\n');

  // ============================================
  // 📊 Zusammenfassung
  // ============================================
  const totalCompanies = await prisma.company.count();
  const totalJobs = await prisma.job.count();

  console.log('');
  console.log('✅ ════════════════════════════════════════');
  console.log('✅  SEEDING ERFOLGREICH ABGESCHLOSSEN!');
  console.log('✅ ════════════════════════════════════════');
  console.log('');
  console.log(`📊 Statistik:`);
  console.log(`   • ${totalCompanies} Firmen erstellt`);
  console.log(`   • ${totalJobs} Jobs erstellt`);
  console.log(`   • Alle in Frankfurt 🏙️`);
  console.log('');
  console.log('🔐 Test-Firmen E-Mails (Login via /company/login):');
  console.log('   ┌─────────────────────────────────────────────────────');
  console.log('   │ TechVision GmbH');
  console.log('   │ Email: demo-techvision@jobmatching.de');
  console.log('   ├─────────────────────────────────────────────────────');
  console.log('   │ FinanzPro AG');
  console.log('   │ Email: demo-finanzpro@jobmatching.de');
  console.log('   ├─────────────────────────────────────────────────────');
  console.log('   │ MediCare Plus');
  console.log('   │ Email: demo-medicare@jobmatching.de');
  console.log('   ├─────────────────────────────────────────────────────');
  console.log('   │ LogiFlow Solutions');
  console.log('   │ Email: demo-logiflow@jobmatching.de');
  console.log('   ├─────────────────────────────────────────────────────');
  console.log('   │ GreenEnergy GmbH');
  console.log('   │ Email: demo-greenenergy@jobmatching.de');
  console.log('   └─────────────────────────────────────────────────────');
  console.log('');
  console.log('   ⚠️  Hinweis: Da dein System keine Passwörter für Companies');
  console.log('   hat, musst du den Login-Flow anpassen oder die Firmen');
  console.log('   direkt über die Email registrieren.');
  console.log('');
  console.log('🚀 Nächste Schritte:');
  console.log('   1. Teste Login unter /company/login');
  console.log('   2. Sieh dir die Jobs im Dashboard an');
  console.log('   3. Erstelle Test-Bewerber für Matching');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

