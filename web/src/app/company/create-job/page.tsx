"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Company = { id: string; name: string; email: string; industry: string; location: string };

export default function CreateJobPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [jobLocation, setJobLocation] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [industry, setIndustry] = useState("");
  const [creating, setCreating] = useState(false);

  const [availableSkills] = useState([
    "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C#", "PHP",
    "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "DevOps",
    "UI/UX Design", "Figma", "Photoshop", "Marketing", "Sales", "Project Management", "Leadership",
    "Communication", "Analytics", "Data Science", "Machine Learning", "AI", "Cybersecurity"
  ]);

  const [availableIndustries] = useState([
    "IT & Software", "Finanzwesen", "Gesundheitswesen", "Bildung", "E-Commerce", "Marketing & Werbung",
    "Beratung", "Ingenieurwesen", "Medien & Entertainment", "Immobilien", "Automotive", "Telekommunikation",
    "Energie", "Logistik", "Einzelhandel", "Gastronomie", "Recht", "Non-Profit", "Sonstiges"
  ]);

  useEffect(() => {
    const session = localStorage.getItem("companySession");
    if (session) {
      setCompany(JSON.parse(session));
    }
  }, []);

  async function createJob() {
    if (!company || !title || !jobLocation || requiredSkills.length === 0) {
      alert("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    try {
      setCreating(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
          location: jobLocation,
          minExperience,
          industry,
          companyId: company.id,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}: ${await res.text()}`);
      await res.json();
      setTitle("");
      setDescription("");
      setRequiredSkills([]);
      setJobLocation("");
      setMinExperience(0);
      setIndustry("");
      alert("Stelle erfolgreich erstellt!");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nicht angemeldet</h1>
          <Link href="/company/login" className="text-blue-600 hover:text-blue-800 underline">
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/company" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Zurück zum Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Angemeldet als: {company.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem("companySession");
                window.location.href = "/";
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Abmelden
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Neue Stelle erstellen</h1>
            <p className="text-gray-600">Erstellen Sie eine neue Stellenausschreibung für Ihr Unternehmen</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stellentitel *</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="z.B. Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standort *</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                >
                  <option value="">Standort wählen</option>
                  {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(c => 
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mindest-Erfahrung</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(y => 
                    <option key={y} value={y}>{y===0? 'Keine Erfahrung' : y===10? '10+ Jahre' : `${y} Jahr${y>1?'e':''}`}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stellenbeschreibung</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Kurze Beschreibung der Stelle..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branche</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Branche wählen (optional)</option>
                {availableIndustries.map(ind => 
                  <option key={ind} value={ind}>{ind}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Benötigte Skills *</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => requiredSkills.includes(skill) ? setRequiredSkills(requiredSkills.filter(s => s !== skill)) : setRequiredSkills([...requiredSkills, skill])}
                      className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                        requiredSkills.includes(skill) 
                          ? 'bg-blue-100 border-blue-300 text-blue-700 border' 
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              {requiredSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Ausgewählt ({requiredSkills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                        {skill}
                        <button 
                          onClick={() => setRequiredSkills(requiredSkills.filter(s => s !== skill))}
                          className="hover:text-blue-900 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={createJob} 
                disabled={creating}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Erstelle..." : "Stelle erstellen"}
              </button>
              <Link 
                href="/company"
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
              >
                Abbrechen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
