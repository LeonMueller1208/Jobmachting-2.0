"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import SkillsSelector from "@/components/SkillsSelector";
import CultureFitSelector from "@/components/CultureFitSelector";

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

const fieldsOfStudy = {
  "Wirtschaft": [
    "BWL (Betriebswirtschaftslehre)",
    "VWL (Volkswirtschaftslehre)",
    "Wirtschaftswissenschaften",
    "Wirtschaftsinformatik",
    "Wirtschaftsingenieurwesen",
    "International Business",
    "Finance / Banking",
    "Marketing / Vertrieb",
    "Wirtschaftsrecht"
  ],
  "Ingenieurwesen": [
    "Maschinenbau",
    "Elektrotechnik / Elektronik",
    "Informatik",
    "Bauingenieurwesen",
    "Wirtschaftsingenieurwesen",
    "Mechatronik",
    "Verfahrenstechnik / Chemieingenieurwesen",
    "Produktions- und Automatisierungstechnik",
    "Umwelt- und Energietechnik"
  ],
  "Sonstige": [
    "Andere Fachrichtung"
  ]
};

const requiresFieldOfStudy = (education: string) => {
  return ["Bachelor", "Master", "Diplom", "Promotion"].includes(education);
};

export default function EditJob() {
  const [job, setJob] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [requiredEducation, setRequiredEducation] = useState("");
  const [requiredFieldsOfStudy, setRequiredFieldsOfStudy] = useState<string[]>([]);
  const [jobType, setJobType] = useState("");
  const [industry, setIndustry] = useState("");
  const [hierarchy, setHierarchy] = useState<number>(0);
  const [autonomy, setAutonomy] = useState<number>(0);
  const [teamwork, setTeamwork] = useState<number>(0);
  const [workStructure, setWorkStructure] = useState<number>(0);
  const [feedback, setFeedback] = useState<number>(0);
  const [flexibility, setFlexibility] = useState<number>(0);
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
        setRequiredFieldsOfStudy(jobData.requiredFieldsOfStudy || []);
        setJobType(jobData.jobType || "");
        setIndustry(jobData.industry || "");
        setHierarchy(jobData.hierarchy || 0);
        setAutonomy(jobData.autonomy || 0);
        setTeamwork(jobData.teamwork || 0);
        setWorkStructure(jobData.workStructure || 0);
        setFeedback(jobData.feedback || 0);
        setFlexibility(jobData.flexibility || 0);
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
          requiredFieldsOfStudy,
          jobType,
          industry,
          hierarchy,
          autonomy,
          teamwork,
          workStructure,
          feedback,
          flexibility
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
                  {['Kassel', 'Kassel Umgebung'].map(city => (
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
                  {(() => {
                    const options = [];
                    // 0-5 years (exact)
                    for (let i = 0; i <= 5; i++) {
                      options.push(
                        <option key={i} value={i}>
                          {i === 0 ? "Keine Erfahrung erforderlich" : i === 1 ? "1 Jahr" : `${i} Jahre`}
                        </option>
                      );
                    }
                    // Ranges
                    options.push(<option key={6} value={6}>5-10 Jahre</option>);
                    options.push(<option key={11} value={11}>10-15 Jahre</option>);
                    options.push(<option key={16} value={16}>15-20 Jahre</option>);
                    options.push(<option key={21} value={21}>Über 20 Jahre</option>);
                    return options;
                  })()}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Erforderlicher Abschluss</label>
                <select
                  value={requiredEducation}
                  onChange={(e) => {
                    setRequiredEducation(e.target.value);
                    if (!requiresFieldOfStudy(e.target.value)) {
                      setRequiredFieldsOfStudy([]);
                    }
                  }}
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

            {/* Fields of Study - Only for University Degrees */}
            {requiresFieldOfStudy(requiredEducation) && (
              <div className="space-y-4 pt-4 border-t-2 border-green-200">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    📚 Gewünschte Fachrichtungen (optional, Mehrfachauswahl)
                  </p>
                  <p className="text-xs text-green-700">
                    Wenn Sie keine Fachrichtung auswählen, werden alle Fachrichtungen akzeptiert.
                  </p>
                </div>

                {/* Checkboxes by Category */}
                {Object.entries(fieldsOfStudy).map(([category, fields]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b border-gray-300 pb-1">
                      {category}
                    </h3>
                    <div className="space-y-2 pl-2">
                      {fields.map(field => (
                        <label key={field} className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={requiredFieldsOfStudy.includes(field)}
                            onChange={() => {
                              if (requiredFieldsOfStudy.includes(field)) {
                                setRequiredFieldsOfStudy(requiredFieldsOfStudy.filter(f => f !== field));
                              } else {
                                setRequiredFieldsOfStudy([...requiredFieldsOfStudy, field]);
                              }
                            }}
                            className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Selected Count */}
                {requiredFieldsOfStudy.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ✓ <strong>{requiredFieldsOfStudy.length}</strong> Fachrichtung{requiredFieldsOfStudy.length !== 1 ? 'en' : ''} ausgewählt
                    </p>
                  </div>
                )}
              </div>
            )}

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
              <SkillsSelector
                selectedSkills={requiredSkills}
                onSkillsChange={setRequiredSkills}
                colorScheme="green"
                label="Erforderliche Skills"
              />
            </div>

            {/* Soft Factors Section */}
            <div className="border-t-2 border-purple-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🤝</span> Team-Kultur & Werte
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Diese Angaben helfen Bewerbern, kulturell passende Stellen zu finden.
              </p>

              <CultureFitSelector
                hierarchy={hierarchy}
                autonomy={autonomy}
                teamwork={teamwork}
                workStructure={workStructure}
                feedback={feedback}
                flexibility={flexibility}
                setHierarchy={setHierarchy}
                setAutonomy={setAutonomy}
                setTeamwork={setTeamwork}
                setWorkStructure={setWorkStructure}
                setFeedback={setFeedback}
                setFlexibility={setFlexibility}
                colorScheme="green"
              />
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
