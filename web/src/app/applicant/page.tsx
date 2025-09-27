"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { computeMatchingScore } from "@/lib/matching";

type Applicant = { id: string; name: string; email: string; skills: string[]; location: string; experience: number; bio?: string | null };
type Job = { id: string; title: string; description: string; requiredSkills: string[]; location: string; minExperience: number; company: { id: string; name: string; location: string } };

export default function ApplicantDashboard() {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interests, setInterests] = useState<Record<string, { status: "INTERESTED" | "NOT_INTERESTED"; matchScore: number; passes: boolean }>>({});

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const [availableSkills] = useState([
    "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C#", "PHP",
    "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "DevOps",
    "UI/UX Design", "Figma", "Photoshop", "Marketing", "Sales", "Project Management", "Leadership",
    "Communication", "Analytics", "Data Science", "Machine Learning", "AI", "Cybersecurity"
  ]);

  useEffect(() => {
    fetch("/api/jobs").then((r) => r.json()).then(setJobs);
    const stored = localStorage.getItem("applicantSession");
    if (stored) { try { setApplicant(JSON.parse(stored)); } catch {} }
    const last = localStorage.getItem("lastEmail");
    if (last) setEmail(last);
  }, []);

  const jobScores = useMemo(() => {
    if (!applicant) return {} as Record<string, number>;
    const scores: Record<string, number> = {};
    jobs.forEach(job => {
      const s = computeMatchingScore({
        applicant: { 
          skills: applicant.skills as string[], 
          experience: applicant.experience, 
          location: applicant.location,
          bio: applicant.bio || undefined,
          industry: applicant.industry || undefined
        },
        job: { 
          requiredSkills: job.requiredSkills as string[], 
          minExperience: job.minExperience, 
          location: job.location,
          title: job.title,
          description: job.description,
          industry: job.industry || undefined
        }
      });
      scores[job.id] = s;
    });
    return scores;
  }, [applicant, jobs]);

  function addSkill(skill: string) { if (!skills.includes(skill)) setSkills([...skills, skill]); }
  function removeSkill(skill: string) { setSkills(skills.filter(s => s !== skill)); }

  async function login() {
    if (!email) { alert("Bitte E-Mail eingeben"); return; }
    try {
      setLoading(true);
      const res = await fetch(`/api/applicants?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const found = await res.json();
      if (!found) { alert("Kein Konto gefunden. Bitte Signup ausfüllen."); return; }
      setApplicant(found);
      localStorage.setItem("applicantSession", JSON.stringify(found));
      localStorage.setItem("lastEmail", email);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function signup() {
    if (!email || !name || skills.length === 0 || !location) { alert("E-Mail, Name, Skills, Standort erforderlich"); return; }
    try {
      setLoading(true);
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, skills, location, experience: Number(experience)||0, bio }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}: ${await res.text()}`);
      const created = await res.json();
      setApplicant(created);
      localStorage.setItem("applicantSession", JSON.stringify(created));
      localStorage.setItem("lastEmail", email);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function logout() { 
    localStorage.removeItem("applicantSession"); 
    window.location.href = "/";
  }

  async function markInterest(jobId: string, status: "INTERESTED" | "NOT_INTERESTED") {
    if (!applicant) return;
    const res = await fetch("/api/interests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicantId: applicant.id, jobId, status }) });
    const data = await res.json();
    setInterests((prev) => ({ ...prev, [jobId]: { status, matchScore: data.matchScore, passes: data.passes } }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Zurück zur Startseite</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Bewerber-Dashboard</h1>
          </div>
          {applicant ? (
            <button 
              onClick={logout} 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abmelden
            </button>
          ) : null}
        </header>

      {!applicant ? (
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
                  placeholder="ihre@email.com"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrieren</h2>
              <p className="text-gray-600">Neues Bewerberkonto erstellen</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse *</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="ihre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ihr Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Berufserfahrung</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                  >
                    {[0,1,2,3,4,5,6,7,8,9,10].map(y => 
                      <option key={y} value={y}>{y===0? 'Keine Erfahrung' : y===10? '10+ Jahre' : `${y} Jahr${y>1?'e':''}`}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Skills auswählen *</label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                          skills.includes(skill) 
                            ? 'bg-green-100 border-green-300 text-green-700 border' 
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 border'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                {skills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Ausgewählt ({skills.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                          {skill}
                          <button 
                            onClick={() => removeSkill(skill)}
                            className="hover:text-green-900 ml-1"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurze Bio</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Erzählen Sie etwas über sich..."
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <button 
                type="button" 
                onClick={signup} 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Registrieren..." : "Registrieren"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Willkommen, {applicant.name}!</h2>
                <p className="text-gray-600 mt-1">{applicant.location} • {applicant.experience} Jahre Erfahrung</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {applicant.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 5 && (
                    <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                      +{applicant.skills.length - 5} weitere
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Available Jobs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verfügbare Stellen</h3>
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                {jobs.length} Stellen
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => {
                const score = jobScores[job.id] || 0;
                const passes = score >= 70;
                return (
                  <div key={job.id} className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h4>
                        <p className="text-gray-600 mb-2">{job.company?.name} • {job.location}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className={`text-2xl font-bold ${passes ? "text-green-600" : "text-orange-500"}`}>
                          {score}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {passes ? "Gut passend" : "Teilweise passend"}
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
                        <span className="text-sm text-gray-600">Min. {job.minExperience} Jahre Erfahrung</span>
                        {interests[job.id] && (
                          <span className={`text-sm font-medium ${interests[job.id].passes ? "text-green-700" : "text-gray-600"}`}>
                            ✓ {interests[job.id].status === "INTERESTED" ? "Interesse bekundet" : "Nicht interessiert"}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => markInterest(job.id, "INTERESTED")} 
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Interessiert
                        </button>
                        <button 
                          onClick={() => markInterest(job.id, "NOT_INTERESTED")} 
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          Nicht interessiert
                        </button>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Stellen verfügbar</h3>
                  <p className="text-gray-600">Aktuell sind keine passenden Stellen verfügbar. Schauen Sie später nochmal vorbei!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}