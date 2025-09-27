"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

type Company = { id: string; name: string; email: string; industry: string; location: string };
type Job = { id: string; title: string; description: string; requiredSkills: string[]; location: string; minExperience: number; industry?: string | null };
type Interest = { id: string; applicant: { id: string; name: string; skills: string[]; experience: number; location: string; bio?: string | null; industry?: string | null }; job: { id: string; title: string; industry?: string | null }; status: "INTERESTED" | "NOT_INTERESTED"; matchScore: number };

export default function CompanyDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [availableIndustries] = useState(["IT & Software","Finanzwesen","Gesundheitswesen","Bildung","E-Commerce","Marketing & Werbung","Beratung","Ingenieurwesen","Medien & Entertainment","Immobilien","Automotive","Telekommunikation","Energie","Logistik","Einzelhandel","Gastronomie","Recht","Non-Profit","Sonstiges"]);
  const [availableSkills] = useState(["JavaScript","TypeScript","React","Vue.js","Angular","Node.js","Python","Java","C#","PHP","SQL","MongoDB","PostgreSQL","AWS","Docker","Kubernetes","Git","Agile","Scrum","DevOps","UI/UX Design","Figma","Photoshop","Marketing","Sales","Project Management","Leadership","Communication","Analytics","Data Science","Machine Learning","AI","Cybersecurity"]);
  
  // Filter states
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterMinExperience, setFilterMinExperience] = useState(0);

  // Filter helper functions
  function addFilterSkill(skill: string) {
    if (!filterSkills.includes(skill)) {
      setFilterSkills([...filterSkills, skill]);
    }
  }

  function removeFilterSkill(skill: string) {
    setFilterSkills(filterSkills.filter(s => s !== skill));
  }

  // Filtered interests based on selected job and current filters
  const filteredInterests = useMemo(() => {
    return interests.filter(interest => {
      // Job filter - only show applicants for selected job
      if (selectedJobId && interest.job.id !== selectedJobId) {
        return false;
      }
      
      // Location filter
      if (filterLocation && !interest.applicant.location.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }
      
      // Experience filter
      if (filterMinExperience > 0 && interest.applicant.experience < filterMinExperience) {
        return false;
      }
      
      // Skills filter
      if (filterSkills.length > 0) {
        const applicantSkills = Array.isArray(interest.applicant.skills) ? interest.applicant.skills : [];
        const hasMatchingSkill = filterSkills.some(skill => 
          applicantSkills.some(applicantSkill => 
            applicantSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) {
          return false;
        }
      }
      
      return true;
    });
  }, [interests, selectedJobId, filterLocation, filterMinExperience, filterSkills]);

  useEffect(() => {
    const stored = localStorage.getItem("companySession");
    if (stored) { try { setCompany(JSON.parse(stored)); } catch {} }
    const last = localStorage.getItem("lastEmail");
    if (last) setEmail(last);
  }, []);

  useEffect(() => {
    if (!company) return;
    loadJobs();
    loadInterests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.id]);

  async function login() {
    if (!email) { alert("Bitte E-Mail eingeben"); return; }
    try {
      setLoading(true);
      const res = await fetch(`/api/companies?email=${encodeURIComponent(email)}`);
      if (!res.ok) { alert(`Server error ${res.status}`); return; }
      const found = await res.json();
      if (!found) { alert("Kein Firmenkonto gefunden. Bitte Signup ausfüllen."); return; }
      setCompany(found);
      localStorage.setItem("companySession", JSON.stringify(found));
      localStorage.setItem("lastEmail", email);
    } catch (error) {
      alert(`Fehler beim Anmelden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  async function signup() {
    if (!email || !name || !industry || !location) { alert("E-Mail, Firmenname, Branche und Standort erforderlich"); return; }
    try {
      setSignupLoading(true);
      const res = await fetch("/api/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, industry, location }) });
      if (!res.ok) throw new Error(`Server error ${res.status}: ${await res.text()}`);
      const created = await res.json();
      setCompany(created);
      localStorage.setItem("companySession", JSON.stringify(created));
      localStorage.setItem("lastEmail", email);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSignupLoading(false);
    }
  }

  function logout() { 
    localStorage.removeItem("companySession"); 
    window.location.href = "/";
  }

  async function loadJobs() {
    if (!company) return;
    const res = await fetch(`/api/jobs?companyId=${company.id}`);
    setJobs(await res.json());
  }

  async function loadInterests() {
    if (!company) return;
    const res = await fetch(`/api/interests?companyId=${company.id}`);
    const data = await res.json();
    setInterests(data.filter((i: Interest) => i.status === "INTERESTED" && i.passes));
  }


  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Dashboard" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[#1E2A38] hover:text-[#06C755] transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Zurück zur Startseite</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-extrabold text-[#1E2A38] font-inter">Firmen-Dashboard</h1>
          </div>
          {company ? (
            <button 
              type="button" 
              onClick={logout} 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1E2A38] bg-white border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abmelden
            </button>
          ) : null}
        </header>

      {!company ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmelden</h2>
              <p className="text-gray-600">Bereits registriert? Mit E-Mail anmelden</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse</label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="firma@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button 
                type="button" 
                onClick={login} 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Anmelden..." : "Anmelden"}
              </button>
            </div>
          </div>

          {/* Register Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrieren</h2>
              <p className="text-gray-600">Neues Firmenkonto erstellen</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse *</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="firma@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firmenname *</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ihr Firmenname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branche *</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">Branche wählen</option>
                    {availableIndustries.map(ind => 
                      <option key={ind} value={ind}>{ind}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standort *</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Standort wählen</option>
                    {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(c => 
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>
              </div>

              <button 
                type="button" 
                onClick={signup} 
                disabled={signupLoading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {signupLoading ? "Registrieren..." : "Registrieren"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Willkommen, {company.name}!</h2>
                  <p className="text-gray-600 mt-1">{company.industry} • {company.location}</p>
                </div>
              </div>
              <Link 
                href="/company/create-job"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Neue Stelle erstellen
              </Link>
            </div>
          </div>

          {/* My Jobs Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Meine Stellen</h3>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  {jobs.length} Stellen
                </span>
                <button 
                  type="button" 
                  onClick={loadJobs} 
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Aktualisieren
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map(job => {
                const jobInterests = interests.filter(i => i.job.id === job.id);
                const isSelected = selectedJobId === job.id;
                return (
                  <div 
                    key={job.id} 
                    className={`group border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:shadow-lg hover:border-green-300'
                    }`}
                    onClick={() => setSelectedJobId(isSelected ? null : job.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                          {isSelected && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              Ausgewählt
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.location} • Min. {job.minExperience} Jahre Erfahrung</p>
                        {job.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {jobInterests.length}
                        </div>
                        <div className="text-xs text-gray-500">
                          Bewerber
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Benötigte Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(job.requiredSkills) ? job.requiredSkills.slice(0, 4).map(skill => (
                            <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          )) : null}
                          {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 4 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              +{job.requiredSkills.length - 4} weitere
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {isSelected ? 'Klicken zum Abwählen' : 'Klicken zum Auswählen und Bewerber anzeigen'}
                        </div>
                        <Link 
                          href={`/company/edit-job/${job.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Bearbeiten
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {jobs.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Stellen</h3>
                  <p className="text-gray-600">Erstellen Sie Ihre erste Stellenausschreibung oben!</p>
                </div>
              )}
            </div>
          </div>

          {/* Interested Applicants Section - Only show when job is selected */}
          {selectedJobId && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Bewerber für ausgewählte Stelle</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {jobs.find(j => j.id === selectedJobId)?.title} • {filteredInterests.length} Bewerber
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadInterests}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Aktualisieren
                  </button>
                  <button
                    onClick={() => setSelectedJobId(null)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Alle Stellen anzeigen
                  </button>
                </div>
              </div>

            {/* Filters */}
            <div className="ds-card p-6 mb-6">
              <h4 className="text-lg ds-subheading mb-4">Filter</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="ds-label mb-3">Skills filtern:</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-[var(--border-radius-input)] p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {availableSkills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => filterSkills.includes(skill) ? removeFilterSkill(skill) : addFilterSkill(skill)}
                          className={`text-xs px-2 py-1 rounded-[var(--border-radius-input)] transition-all duration-300 ${
                            filterSkills.includes(skill) 
                              ? 'ds-skill-tag-green' 
                              : 'ds-skill-tag-default'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  {filterSkills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs ds-body-light mb-2">Ausgewählt:</p>
                      <div className="flex flex-wrap gap-1">
                        {filterSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center gap-1 ds-skill-tag-green">
                            {skill}
                            <button 
                              onClick={() => removeFilterSkill(skill)}
                              className="hover:text-[var(--accent-green-dark)] transition-colors duration-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="ds-label mb-2">Standort:</label>
                  <select 
                    className="ds-input ds-input-focus-green"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">Alle Standorte</option>
                    {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(c => 
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="ds-label mb-2">Min. Erfahrung:</label>
                  <select 
                    className="ds-input ds-input-focus-green"
                    value={filterMinExperience}
                    onChange={(e) => setFilterMinExperience(Number(e.target.value))}
                  >
                    {[0,1,2,3,4,5,6,7,8,9,10].map(y => 
                      <option key={y} value={y}>{y===0? 'Keine Erfahrung' : y===10? '10+ Jahre' : `${y} Jahr${y>1?'e':''}`}</option>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <button 
                  onClick={() => {
                    setFilterSkills([]);
                    setFilterLocation("");
                    setFilterMinExperience(0);
                  }}
                  className="ds-link-green text-sm hover:underline"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>

            {/* Applicants List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInterests.sort((a,b)=>b.matchScore-a.matchScore).map(it => (
                <div key={it.id} className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{it.applicant.name}</h4>
                      <p className="text-gray-600 mb-2">Match: {it.matchScore}% • Job: {it.job.title}</p>
                      {it.applicant.bio && (
                        <p className="text-sm text-gray-700 line-clamp-2">{it.applicant.bio}</p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {it.matchScore}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Match Score
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(it.applicant.skills) ? it.applicant.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        )) : null}
                        {Array.isArray(it.applicant.skills) && it.applicant.skills.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{it.applicant.skills.length - 4} weitere
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{it.applicant.experience} Jahre Erfahrung</span>
                      <span>{it.applicant.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredInterests.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Bewerber gefunden</h3>
                  <p className="text-gray-600">Keine Bewerber entsprechen den aktuellen Filtern.</p>
                </div>
              )}
            </div>
          </div>
          )}

          {/* No Job Selected Message */}
          {!selectedJobId && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Wählen Sie eine Stelle aus</h3>
              <p className="text-gray-600">Klicken Sie auf eine Stelle oben, um die Bewerber für diese Position anzuzeigen.</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}