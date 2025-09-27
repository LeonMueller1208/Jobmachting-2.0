"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type Company = { id: string; name: string; email: string; industry: string; location: string };
type Job = { 
  id: string; 
  title: string; 
  description: string; 
  requiredSkills: string[]; 
  location: string; 
  minExperience: number;
  industry?: string | null;
  companyId: string;
};

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [jobLocation, setJobLocation] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableSkills = [
    "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C#", "PHP",
    "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "DevOps",
    "UI/UX Design", "Figma", "Photoshop", "Marketing", "Sales", "Project Management", "Leadership",
    "Communication", "Analytics", "Data Science", "Machine Learning", "AI", "Cybersecurity"
  ];

  const availableIndustries = [
    "IT & Software", "Finanzwesen", "Gesundheitswesen", "Bildung", "E-Commerce", "Marketing & Werbung",
    "Beratung", "Ingenieurwesen", "Medien & Entertainment", "Immobilien", "Automotive", "Telekommunikation",
    "Energie", "Logistik", "Einzelhandel", "Gastronomie", "Recht", "Non-Profit", "Sonstiges"
  ];

  useEffect(() => {
    const session = localStorage.getItem("companySession");
    if (session) {
      try {
        const companyData = JSON.parse(session);
        setCompany(companyData);
      } catch (error) {
        console.error("Error parsing company session:", error);
        router.push("/company");
        return;
      }
    } else {
      router.push("/company");
      return;
    }

    // Load job data
    console.log("Loading job with ID:", params.id);
    fetch(`/api/jobs/${params.id}`)
      .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(jobData => {
        console.log("Job data received:", jobData);
        if (jobData.error) {
          throw new Error(jobData.error);
        }
        setJob(jobData);
        setTitle(jobData.title);
        setDescription(jobData.description);
        setRequiredSkills(jobData.requiredSkills || []);
        setJobLocation(jobData.location);
        setMinExperience(jobData.minExperience);
        setIndustry(jobData.industry || "");
      })
      .catch(error => {
        console.error("Error loading job:", error);
        alert(`Fehler beim Laden der Stelle: ${error.message}`);
        router.push("/company");
      });
  }, [params.id, router]);

  function addSkill(skill: string) {
    if (!requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  }

  async function handleUpdate() {
    if (!title || !jobLocation || requiredSkills.length === 0) {
      alert("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
          location: jobLocation,
          minExperience,
          industry,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/company");
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      alert(`Fehler beim Aktualisieren: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Sind Sie sicher, dass Sie diese Stelle löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }
      
      router.push("/company");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  if (!company || !job) {
    return (
      <div className="min-h-screen ds-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl ds-heading mb-4">Lade Stelle...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Stelle bearbeiten" showBackButton={true} backHref="/company" />
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Stelle erfolgreich aktualisiert!</h2>
            <p className="ds-body-light mb-6">Sie werden automatisch zum Dashboard weitergeleitet...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[var(--accent-green)] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
        <div className="text-center mb-8">
          <Link href="/company" className="inline-flex items-center ds-link-green mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zum Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl ds-heading mb-3">Stelle bearbeiten</h1>
          <p className="text-base lg:text-lg font-light ds-body">Aktualisieren Sie die Stellenausschreibung</p>
        </div>

        <div className="ds-card p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label mb-2">Stellentitel *</label>
                <input 
                  className="ds-input ds-input-focus-blue"
                  placeholder="z.B. Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="ds-label mb-2">Standort *</label>
                <select 
                  className="ds-input ds-input-focus-blue"
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
                <label className="ds-label mb-2">Mindest-Erfahrung</label>
                <select 
                  className="ds-input ds-input-focus-blue"
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(y => 
                    <option key={y} value={y}>{y===0? 'Keine Erfahrung' : y===10? '10+ Jahre' : `${y} Jahr${y>1?'e':''}`}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="ds-label mb-2">Branche</label>
                <select 
                  className="ds-input ds-input-focus-blue"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Branche wählen (optional)</option>
                  {availableIndustries.map(ind => 
                    <option key={ind} value={ind}>{ind}</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="ds-label mb-2">Stellenbeschreibung</label>
              <textarea 
                className="ds-input ds-input-focus-blue"
                placeholder="Kurze Beschreibung der Stelle..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="ds-label mb-3">Benötigte Skills *</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => requiredSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      className={`ds-skill-tag ${
                        requiredSkills.includes(skill) 
                          ? 'ds-skill-tag-blue' 
                          : 'ds-skill-tag-default'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              {requiredSkills.length > 0 && (
                <div className="mt-3">
                  <p className="ds-body-light text-sm mb-2">Ausgewählt ({requiredSkills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 ds-skill-tag-blue text-sm px-3 py-1 rounded-full">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
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
                onClick={handleUpdate} 
                disabled={loading}
                className="flex-1 ds-button-primary-blue"
              >
                {loading ? "Aktualisiere..." : "Stelle aktualisieren"}
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-[12px] font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? "Lösche..." : "Stelle löschen"}
              </button>
              <Link 
                href="/company"
                className="flex-1 ds-button-secondary text-center"
              >
                Abbrechen
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
