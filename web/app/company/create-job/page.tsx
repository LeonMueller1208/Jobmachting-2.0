"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [requiredEducation, setRequiredEducation] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  function addSkill(skill: string) {
    if (!requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  }

  async function handleSubmit() {
    if (!title || !description || requiredSkills.length === 0 || !location) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen: Titel, Beschreibung, Skills und Standort");
      setShowError(true);
      return;
    }

    const companySession = localStorage.getItem("companySession");
    if (!companySession) {
      setErrorMessage("Bitte melden Sie sich an");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const company = JSON.parse(companySession);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
          location,
          minExperience,
          requiredEducation,
          industry,
          companyId: company.id,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setRequiredSkills([]);
        setLocation("");
        setMinExperience(0);
        setRequiredEducation("");
        setIndustry("");
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/company");
        }, 2000);
      } else {
        const error = await res.json();
        setErrorMessage(error.error || "Unbekannter Fehler");
        setShowError(true);
      }
    } catch (error) {
      console.error("Job creation error:", error);
      setErrorMessage(`Fehler beim Erstellen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Stelle erstellen" showBackButton={true} backHref="/company" />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2">Neue Stelle erstellen</h1>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Erstellen Sie eine neue Stellenausschreibung</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="ds-label">Stellentitel *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="ds-input ds-input-focus-green"
                placeholder="z.B. Senior React Developer"
              />
            </div>

            <div>
              <label className="ds-label">Stellenbeschreibung *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="ds-input ds-input-focus-green"
                rows={6}
                placeholder="Beschreiben Sie die Stelle, Aufgaben, Anforderungen und was Sie bieten..."
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
                <label className="ds-label">Min. Erfahrung (Jahre)</label>
                <input
                  type="number"
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                  className="ds-input ds-input-focus-green"
                  min="0"
                  max="20"
                />
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
              <label className="ds-label">Benötigte Skills * (mindestens 1)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-[var(--border-radius-input)] p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full ds-button-primary-green"
            >
              {loading ? "Erstelle Stelle..." : "Stelle erstellen"}
            </button>
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
            <h2 className="text-2xl ds-heading mb-2">Stelle erfolgreich erstellt!</h2>
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
            <h2 className="text-2xl ds-heading mb-2">Fehler beim Erstellen</h2>
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
    </div>
  );
}
