"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SkillsSelector from "@/components/SkillsSelector";
import CultureFitSelector from "@/components/CultureFitSelector";

const availableIndustries = [
  "IT & Software", "Finanzwesen", "Gesundheitswesen", "E-Commerce", "Automotive", 
  "Medien & Marketing", "Bildung", "Logistik", "Energie", "Immobilien", "Sonstige"
];

const availableEducation = [
  "Hauptschulabschluss",
  "Realschulabschluss",
  "Abitur",
  "Bachelor",
  "Master",
  "Promotion"
];

const fieldCategories = [
  "Wirtschaft",
  "Ingenieurwesen",
  "Sonstige"
];

const fieldsByCategory: Record<string, string[]> = {
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

export default function EditApplicant() {
  const [applicant, setApplicant] = useState<any>(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [education, setEducation] = useState("");
  const [fieldOfStudyCategory, setFieldOfStudyCategory] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [bio, setBio] = useState("");
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
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("applicantSession");
    if (session) {
      const data = JSON.parse(session);
      setApplicant(data);
      setName(data.name || "");
      setSkills(data.skills || []);
      setLocation(data.location || "");
      setExperience(data.experience || 0);
      setEducation(data.education || "");
      setFieldOfStudyCategory(data.fieldOfStudyCategory || "");
      setFieldOfStudy(data.fieldOfStudy || "");
      setBio(data.bio || "");
      setIndustry(data.industry || "");
      setHierarchy(data.hierarchy || 0);
      setAutonomy(data.autonomy || 0);
      setTeamwork(data.teamwork || 0);
      setWorkStructure(data.workStructure || 0);
      setFeedback(data.feedback || 0);
      setFlexibility(data.flexibility || 0);
    }
  }, []);


  async function handleUpdate() {
    if (!applicant || !name || skills.length === 0 || !location) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen: Name, Skills und Standort.");
      setShowError(true);
      return;
    }
    
    // Validate field of study if university degree is selected
    if (requiresFieldOfStudy(education) && (!fieldOfStudyCategory || !fieldOfStudy)) {
      setErrorMessage("Bitte wähle für deinen Hochschulabschluss einen Fachbereich und eine Fachrichtung aus.");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/applicants/${applicant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          skills, 
          location, 
          experience: Number(experience) || 0, 
          education,
          fieldOfStudyCategory,
          fieldOfStudy,
          bio, 
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
      
      const updatedApplicant = await res.json();
      localStorage.setItem("applicantSession", JSON.stringify(updatedApplicant));
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/applicant");
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
    if (!applicant) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/applicants/${applicant.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }

      // Clear session and redirect to homepage
      localStorage.removeItem("applicantSession");
      router.push("/");
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(`Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setShowError(true);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  if (!applicant) {
    return (
      <div className="ds-background min-h-screen flex items-center justify-center">
        <div className="text-lg">Lade Profildaten...</div>
      </div>
    );
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Profil bearbeiten" showBackButton={true} backHref="/applicant" />
      
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-blue rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2">Profil bearbeiten</h1>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Aktualisieren Sie Ihre Bewerberdaten</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ds-input ds-input-focus-blue"
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <label className="ds-label">Standort *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="ds-input ds-input-focus-blue"
                >
                  <option value="">Standort wählen</option>
                  {['Kassel', 'Kassel Umgebung'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Berufserfahrung (Jahre)</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="ds-input ds-input-focus-blue"
                >
                  {(() => {
                    const options = [];
                    // 0-5 years (exact)
                    for (let i = 0; i <= 5; i++) {
                      options.push(
                        <option key={i} value={i}>
                          {i === 0 ? "Keine Erfahrung" : i === 1 ? "1 Jahr" : `${i} Jahre`}
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
              <div>
                <label className="ds-label flex items-center gap-2">
                  Höchster Abschluss
                  <div className="group relative">
                    <svg className="w-4 h-4 text-blue-600 hover:text-blue-700 cursor-help transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="font-semibold mb-1">💡 Wichtig zu wissen:</p>
                      <p>
                        Du kannst auch deinen <strong>aktuellen oder angestrebten</strong> Abschluss angeben! 
                        Wenn du gerade im Master studierst, wähle einfach <strong>"Master"</strong> – du musst nicht bis zum Abschluss warten.
                      </p>
                      {/* Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </label>
                <select
                  value={education}
                  onChange={(e) => {
                    setEducation(e.target.value);
                    if (!requiresFieldOfStudy(e.target.value)) {
                      setFieldOfStudyCategory("");
                      setFieldOfStudy("");
                    }
                  }}
                  className="ds-input ds-input-focus-blue"
                >
                  <option value="">Abschluss wählen (optional)</option>
                  {availableEducation.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field of Study - Only for University Degrees */}
            {requiresFieldOfStudy(education) && (
              <div className="space-y-4 pt-4 border-t-2 border-blue-200">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    📚 Da du einen Hochschulabschluss angegeben hast, benötigen wir noch deine Fachrichtung (Pflichtfeld).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Dropdown */}
                  <div>
                    <label className="ds-label text-red-600">Fachbereich *</label>
                    <select
                      value={fieldOfStudyCategory}
                      onChange={(e) => {
                        setFieldOfStudyCategory(e.target.value);
                        setFieldOfStudy("");
                      }}
                      className="ds-input ds-input-focus-blue"
                    >
                      <option value="">Fachbereich wählen...</option>
                      {fieldCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field of Study Dropdown - Only when category selected */}
                  {fieldOfStudyCategory && (
                    <div>
                      <label className="ds-label text-red-600">Fachrichtung *</label>
                      <select
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        className="ds-input ds-input-focus-blue"
                      >
                        <option value="">Fachrichtung wählen...</option>
                        {fieldsByCategory[fieldOfStudyCategory]?.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Bevorzugte Branche</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="ds-input ds-input-focus-blue"
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
                selectedSkills={skills}
                onSkillsChange={setSkills}
                colorScheme="blue"
                label="Skills"
              />
            </div>

            {/* Soft Factors Section */}
            <div className="border-t-2 border-purple-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🤝</span> Arbeitskultur & Werte
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Diese Angaben helfen uns, Jobs zu finden, die kulturell zu dir passen.
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
                colorScheme="blue"
              />
            </div>

            <div>
              <label className="ds-label">Kurze Beschreibung (optional)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="ds-input ds-input-focus-blue"
                rows={4}
                placeholder="Erzählen Sie kurz über sich, Ihre Interessen und beruflichen Ziele..."
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full ds-button-primary-blue"
            >
              {loading ? "Aktualisiere Profil..." : "Profil aktualisieren"}
            </button>

            {/* Delete Profile Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="w-full mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-[var(--border-radius-button)] shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              Profil löschen
            </button>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 ds-icon-container-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Profil erfolgreich aktualisiert!</h2>
            <p className="ds-body-light mb-6">Sie werden automatisch zum Dashboard weitergeleitet...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[var(--accent-blue)] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
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
              className="ds-button-primary-blue"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Profil wirklich löschen?</h2>
            <p className="ds-body-light mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, Chats und Interessen werden dauerhaft gelöscht.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-[var(--border-radius-button)] transition-all duration-300"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-[var(--border-radius-button)] shadow-md hover:shadow-lg transition-all duration-300"
              >
                {deleting ? "Lösche..." : "Endgültig löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
