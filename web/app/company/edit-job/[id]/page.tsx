"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

const availableSkills = [
  "JavaScript", "Python", "Java", "React", "SQL", "HTML/CSS", "Node.js", "TypeScript",
  "Projektmanagement", "Teamführung", "Kommunikation", "Kundenbetreuung", "Marketing", "Verkauf",
  "Buchhaltung", "Datenanalyse", "Präsentationen", "MS Office", "Qualitätssicherung", "Logistik"
];

const availableIndustries = [
  "IT & Software", "Finanzwesen", "Gesundheitswesen", "E-Commerce", "Automotive", 
  "Medien & Marketing", "Bildung", "Logistik", "Energie", "Immobilien", "Sonstige"
];

const availableEducation = [
  "Keine Angabe",
  "Hauptschulabschluss",
  "Realschulabschluss",
  "Abitur",
  "Bachelor",
  "Master",
  "Promotion"
];

const availableJobTypes = [
  "Vollzeit",
  "Teilzeit",
  "Praktikum",
  "Werkstudent",
  "Minijob",
  "Freelance",
  "Ausbildung"
];

export default function EditJob() {
  const [job, setJob] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [requiredEducation, setRequiredEducation] = useState("");
  const [jobType, setJobType] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const jobData = await res.json();
        setJob(jobData);
        setTitle(jobData.title || "");
        setDescription(jobData.description || "");
        setRequiredSkills(jobData.requiredSkills || []);
        setLocation(jobData.location || "");
        setMinExperience(jobData.minExperience || 0);
        setRequiredEducation(jobData.requiredEducation || "");
        setJobType(jobData.jobType || "");
        setIndustry(jobData.industry || "");
      } catch (error) {
        console.error("Error fetching job:", error);
        alert("Fehler beim Laden der Stellendaten");
        router.push("/company");
      }
    }

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  function addSkill(skill: string) {
    if (!requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  }

  async function handleUpdate() {
    if (!title || !description || requiredSkills.length === 0 || !location) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen: Titel, Beschreibung, Skills und Standort.");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          requiredSkills, 
          location, 
          minExperience: Number(minExperience) || 0, 
          requiredEducation,
          jobType,
          industry 
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
      setErrorMessage(`Fehler beim Aktualisieren: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }
      
      router.push("/company");
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(`Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setShowError(true);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  if (!job) {
    return (
      <div className="ds-background min-h-screen flex items-center justify-center">
        <div className="text-lg">Lade Stellendaten...</div>
      </div>
    );
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Stelle bearbeiten" showBackButton={true} backHref="/company" />
      
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2">Stelle bearbeiten</h1>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Aktualisieren Sie Ihre Stellenausschreibung</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="ds-label">Stellentitel *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="ds-input ds-input-focus-green"
                placeholder="z.B. Senior Frontend Developer"
              />
            </div>

            <div>
              <label className="ds-label">Stellenbeschreibung *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="ds-input ds-input-focus-green"
                rows={6}
                placeholder="Beschreiben Sie die Position, Aufgaben und was Sie bieten..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Standort *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="ds-input ds-input-focus-green"
                >
                  <option value="">Standort wählen</option>
                  {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ds-label">Min. Berufserfahrung (Jahre)</label>
                <select
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                  className="ds-input ds-input-focus-green"
                >
                  {[...Array(21)].map((_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? "Keine Erfahrung erforderlich" : i === 1 ? "1 Jahr" : `${i} Jahre`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Erforderlicher Abschluss</label>
                <select
                  value={requiredEducation}
                  onChange={(e) => setRequiredEducation(e.target.value)}
                  className="ds-input ds-input-focus-green"
                >
                  <option value="">Abschluss wählen (optional)</option>
                  {availableEducation.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ds-label">Job-Art</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="ds-input ds-input-focus-green"
                >
                  <option value="">Job-Art wählen (optional)</option>
                  {availableJobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Branche</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="ds-input ds-input-focus-green"
                >
                  <option value="">Branche wählen (optional)</option>
                  {availableIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="ds-label">Erforderliche Skills * (mindestens 1)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-[var(--border-radius-input)] p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => requiredSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      className={`text-sm px-3 py-2 rounded-[var(--border-radius-input)] border transition-all duration-300 ${
                        requiredSkills.includes(skill) 
                          ? 'ds-skill-tag-green' 
                          : 'ds-skill-tag-default'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              {requiredSkills.length > 0 && (
                <div>
                  <p className="text-sm ds-body-light mb-2">Ausgewählte Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-2 ds-skill-tag-green">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
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

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 ds-button-primary-green"
              >
                {loading ? "Aktualisiere Stelle..." : "Stelle aktualisieren"}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-[var(--border-radius-button)] font-medium transition-all duration-300"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      </main>

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

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Fehler beim Aktualisieren</h2>
            <p className="ds-body-light mb-6">{errorMessage}</p>
            <button 
              onClick={() => setShowError(false)}
              className="ds-button-primary-green"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Stelle wirklich löschen?</h2>
            <p className="ds-body-light mb-6">Diese Aktion kann nicht rückgängig gemacht werden. Alle Bewerbungen zu dieser Stelle gehen verloren.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 ds-button-secondary"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-[var(--border-radius-button)] font-medium transition-all duration-300"
              >
                {loading ? "Lösche..." : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
