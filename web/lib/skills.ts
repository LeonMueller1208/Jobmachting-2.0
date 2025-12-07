// Gemeinsame Skill-Datenbank für Bewerber und Jobs
// Strukturiert nach Kategorien für Wirtschafts- und Ingenieursabsolventen

export type SkillCategory = 
  | "wirtschaft" 
  | "ingenieur" 
  | "it" 
  | "soft-skills" 
  | "tools" 
  | "methoden";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export const SKILL_CATEGORIES: Record<SkillCategory, { label: string; icon: string }> = {
  "wirtschaft": { label: "Wirtschaft & Business", icon: "💼" },
  "ingenieur": { label: "Ingenieurwesen & Technik", icon: "⚙️" },
  "it": { label: "IT & Digitalisierung", icon: "💻" },
  "soft-skills": { label: "Soft Skills & Kommunikation", icon: "🤝" },
  "tools": { label: "Tools & Software", icon: "🛠️" },
  "methoden": { label: "Methoden & Prozesse", icon: "📊" },
};

export const ALL_SKILLS: Skill[] = [
  // Wirtschaft & Business
  { id: "buchhaltung", name: "Buchhaltung", category: "wirtschaft" },
  { id: "kostenrechnung", name: "Kostenrechnung", category: "wirtschaft" },
  { id: "controlling", name: "Controlling", category: "wirtschaft" },
  { id: "finanzplanung", name: "Finanzplanung", category: "wirtschaft" },
  { id: "investitionsrechnung", name: "Investitionsrechnung", category: "wirtschaft" },
  { id: "bilanzanalyse", name: "Bilanzanalyse", category: "wirtschaft" },
  { id: "ifrs", name: "IFRS", category: "wirtschaft" },
  { id: "hgb", name: "HGB", category: "wirtschaft" },
  { id: "marketing", name: "Marketing", category: "wirtschaft" },
  { id: "digital-marketing", name: "Digital Marketing", category: "wirtschaft" },
  { id: "social-media-marketing", name: "Social Media Marketing", category: "wirtschaft" },
  { id: "content-marketing", name: "Content Marketing", category: "wirtschaft" },
  { id: "seo", name: "SEO", category: "wirtschaft" },
  { id: "verkauf", name: "Verkauf", category: "wirtschaft" },
  { id: "key-account-management", name: "Key Account Management", category: "wirtschaft" },
  { id: "b2b-sales", name: "B2B Sales", category: "wirtschaft" },
  { id: "crm", name: "CRM", category: "wirtschaft" },
  { id: "strategische-planung", name: "Strategische Planung", category: "wirtschaft" },
  { id: "business-development", name: "Business Development", category: "wirtschaft" },
  { id: "marktanalyse", name: "Marktanalyse", category: "wirtschaft" },
  { id: "wettbewerbsanalyse", name: "Wettbewerbsanalyse", category: "wirtschaft" },
  { id: "projektmanagement", name: "Projektmanagement", category: "wirtschaft" },
  { id: "prozessoptimierung", name: "Prozessoptimierung", category: "wirtschaft" },
  { id: "personalwesen", name: "Personalwesen", category: "wirtschaft" },
  { id: "recruiting", name: "Recruiting", category: "wirtschaft" },
  { id: "personalentwicklung", name: "Personalentwicklung", category: "wirtschaft" },
  { id: "employer-branding", name: "Employer Branding", category: "wirtschaft" },
  { id: "lohnabrechnung", name: "Lohnabrechnung", category: "wirtschaft" },
  { id: "einkauf", name: "Einkauf", category: "wirtschaft" },
  { id: "beschaffung", name: "Beschaffung", category: "wirtschaft" },
  { id: "supply-chain-management", name: "Supply Chain Management", category: "wirtschaft" },
  { id: "logistik", name: "Logistik", category: "wirtschaft" },
  { id: "lagerwirtschaft", name: "Lagerwirtschaft", category: "wirtschaft" },
  { id: "beschaffungsstrategie", name: "Beschaffungsstrategie", category: "wirtschaft" },

  // Ingenieurwesen & Technik
  { id: "cad-solidworks", name: "CAD (SolidWorks)", category: "ingenieur" },
  { id: "cad-inventor", name: "CAD (Inventor)", category: "ingenieur" },
  { id: "cad-catia", name: "CAD (CATIA)", category: "ingenieur" },
  { id: "konstruktion", name: "Konstruktion", category: "ingenieur" },
  { id: "fertigungstechnik", name: "Fertigungstechnik", category: "ingenieur" },
  { id: "qualitaetsmanagement", name: "Qualitätsmanagement", category: "ingenieur" },
  { id: "produktentwicklung", name: "Produktentwicklung", category: "ingenieur" },
  { id: "simulation", name: "Simulation", category: "ingenieur" },
  { id: "schaltungsentwicklung", name: "Schaltungsentwicklung", category: "ingenieur" },
  { id: "embedded-systems", name: "Embedded Systems", category: "ingenieur" },
  { id: "automatisierungstechnik", name: "Automatisierungstechnik", category: "ingenieur" },
  { id: "messtechnik", name: "Messtechnik", category: "ingenieur" },
  { id: "elektronik", name: "Elektronik", category: "ingenieur" },
  { id: "regelungstechnik", name: "Regelungstechnik", category: "ingenieur" },
  { id: "produktionsplanung", name: "Produktionsplanung", category: "ingenieur" },
  { id: "lean-management", name: "Lean Management", category: "ingenieur" },
  { id: "six-sigma", name: "Six Sigma", category: "ingenieur" },
  { id: "wertstromanalyse", name: "Wertstromanalyse", category: "ingenieur" },
  { id: "statik", name: "Statik", category: "ingenieur" },
  { id: "bauplanung", name: "Bauplanung", category: "ingenieur" },
  { id: "bim", name: "BIM", category: "ingenieur" },
  { id: "projektsteuerung", name: "Projektsteuerung", category: "ingenieur" },
  { id: "ausschreibung", name: "Ausschreibung", category: "ingenieur" },
  { id: "baurecht", name: "Baurecht", category: "ingenieur" },
  { id: "problemloesung", name: "Problemlösung", category: "ingenieur" },
  { id: "technische-dokumentation", name: "Technische Dokumentation", category: "ingenieur" },
  { id: "normen-standards", name: "Normen & Standards (DIN, ISO)", category: "ingenieur" },
  { id: "prototyping", name: "Prototyping", category: "ingenieur" },
  { id: "testing", name: "Testing", category: "ingenieur" },

  // IT & Digitalisierung
  { id: "python", name: "Python", category: "it" },
  { id: "java", name: "Java", category: "it" },
  { id: "matlab", name: "MATLAB", category: "it" },
  { id: "vba", name: "VBA", category: "it" },
  { id: "sql", name: "SQL", category: "it" },
  { id: "r", name: "R", category: "it" },
  { id: "c-plusplus", name: "C++", category: "it" },
  { id: "c-sharp", name: "C#", category: "it" },
  { id: "javascript", name: "JavaScript", category: "it" },
  { id: "typescript", name: "TypeScript", category: "it" },
  { id: "datenanalyse", name: "Datenanalyse", category: "it" },
  { id: "excel-fortgeschritten", name: "Excel (fortgeschritten)", category: "it" },
  { id: "power-bi", name: "Power BI", category: "it" },
  { id: "tableau", name: "Tableau", category: "it" },
  { id: "datenvisualisierung", name: "Datenvisualisierung", category: "it" },
  { id: "statistik", name: "Statistik", category: "it" },
  { id: "machine-learning-basics", name: "Machine Learning Basics", category: "it" },
  { id: "erp-sap", name: "ERP (SAP)", category: "it" },
  { id: "erp-microsoft-dynamics", name: "ERP (Microsoft Dynamics)", category: "it" },
  { id: "plm", name: "PLM", category: "it" },
  { id: "mes", name: "MES", category: "it" },
  { id: "sharepoint", name: "SharePoint", category: "it" },
  { id: "datenbanken", name: "Datenbanken", category: "it" },
  { id: "industrie-4-0", name: "Industrie 4.0", category: "it" },
  { id: "iot-basics", name: "IoT Basics", category: "it" },
  { id: "digital-transformation", name: "Digital Transformation", category: "it" },
  { id: "prozessautomatisierung", name: "Prozessautomatisierung", category: "it" },
  { id: "html-css", name: "HTML/CSS", category: "it" },
  { id: "react", name: "React", category: "it" },
  { id: "node-js", name: "Node.js", category: "it" },

  // Soft Skills & Kommunikation
  { id: "praesentation", name: "Präsentation", category: "soft-skills" },
  { id: "verhandlungsgeschick", name: "Verhandlungsgeschick", category: "soft-skills" },
  { id: "moderation", name: "Moderation", category: "soft-skills" },
  { id: "schriftliche-kommunikation", name: "Schriftliche Kommunikation", category: "soft-skills" },
  { id: "interkulturelle-kommunikation", name: "Interkulturelle Kommunikation", category: "soft-skills" },
  { id: "teamarbeit", name: "Teamarbeit", category: "soft-skills" },
  { id: "projektleitung", name: "Projektleitung", category: "soft-skills" },
  { id: "konfliktmanagement", name: "Konfliktmanagement", category: "soft-skills" },
  { id: "motivation", name: "Motivation", category: "soft-skills" },
  { id: "feedback-geben", name: "Feedback geben", category: "soft-skills" },
  { id: "analytisches-denken", name: "Analytisches Denken", category: "soft-skills" },
  { id: "kreativitaet", name: "Kreativität", category: "soft-skills" },
  { id: "zeitmanagement", name: "Zeitmanagement", category: "soft-skills" },
  { id: "selbstorganisation", name: "Selbstorganisation", category: "soft-skills" },
  { id: "stressresistenz", name: "Stressresistenz", category: "soft-skills" },
  { id: "lernbereitschaft", name: "Lernbereitschaft", category: "soft-skills" },
  { id: "kommunikation", name: "Kommunikation", category: "soft-skills" },

  // Tools & Software
  { id: "excel", name: "Excel", category: "tools" },
  { id: "powerpoint", name: "PowerPoint", category: "tools" },
  { id: "word", name: "Word", category: "tools" },
  { id: "outlook", name: "Outlook", category: "tools" },
  { id: "teams", name: "Teams", category: "tools" },
  { id: "sap", name: "SAP", category: "tools" },
  { id: "microsoft-dynamics", name: "Microsoft Dynamics", category: "tools" },
  { id: "matlab-tool", name: "MATLAB", category: "tools" },
  { id: "solidworks", name: "SolidWorks", category: "tools" },
  { id: "autocad", name: "AutoCAD", category: "tools" },
  { id: "catia", name: "CATIA", category: "tools" },
  { id: "jira", name: "Jira", category: "tools" },
  { id: "confluence", name: "Confluence", category: "tools" },
  { id: "salesforce", name: "Salesforce", category: "tools" },
  { id: "hubspot", name: "HubSpot", category: "tools" },
  { id: "adobe-creative-suite", name: "Adobe Creative Suite", category: "tools" },
  { id: "figma", name: "Figma", category: "tools" },
  { id: "sketch", name: "Sketch", category: "tools" },
  { id: "canva", name: "Canva", category: "tools" },
  { id: "visio", name: "Visio", category: "tools" },
  { id: "ms-office", name: "MS Office", category: "tools" },

  // Methoden & Prozesse
  { id: "agile", name: "Agile", category: "methoden" },
  { id: "scrum", name: "Scrum", category: "methoden" },
  { id: "kanban", name: "Kanban", category: "methoden" },
  { id: "projektplanung", name: "Projektplanung", category: "methoden" },
  { id: "risikomanagement", name: "Risikomanagement", category: "methoden" },
  { id: "kaizen", name: "Kaizen", category: "methoden" },
  { id: "iso-9001", name: "ISO 9001", category: "methoden" },
  { id: "fmea", name: "FMEA", category: "methoden" },
  { id: "swot", name: "SWOT", category: "methoden" },
  { id: "business-model-canvas", name: "Business Model Canvas", category: "methoden" },
  { id: "design-thinking", name: "Design Thinking", category: "methoden" },
  { id: "root-cause-analysis", name: "Root Cause Analysis", category: "methoden" },
  { id: "kpi-definition", name: "KPI-Definition", category: "methoden" },
  { id: "wasserfall", name: "Wasserfall", category: "methoden" },
];

// Beliebte Skills für Quick-Picks
export const POPULAR_SKILLS = [
  "Excel",
  "PowerPoint",
  "SAP",
  "Python",
  "Projektmanagement",
  "Kommunikation",
  "Teamarbeit",
  "Präsentation",
  "Datenanalyse",
  "Power BI",
];

// Helper-Funktionen
export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return ALL_SKILLS.filter(skill => skill.category === category);
}

export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return ALL_SKILLS;
  
  return ALL_SKILLS.filter(skill => 
    skill.name.toLowerCase().includes(lowerQuery)
  );
}

export function getSkillByName(name: string): Skill | undefined {
  return ALL_SKILLS.find(skill => skill.name === name);
}

