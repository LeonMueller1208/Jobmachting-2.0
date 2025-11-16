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
  "Hauptschulabschluss",
  "Realschulabschluss",
  "Abitur",
  "Bachelor",
  "Master",
  "Promotion"
];

export default function EditApplicant() {
  const [applicant, setApplicant] = useState<any>(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [education, setEducation] = useState("");
  const [bio, setBio] = useState("");
  const [industry, setIndustry] = useState("");
  const [workValues, setWorkValues] = useState<string[]>([]);
  const [teamStyle, setTeamStyle] = useState("");
  const [workEnvironment, setWorkEnvironment] = useState("");
  const [motivation, setMotivation] = useState("");
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
      setBio(data.bio || "");
      setIndustry(data.industry || "");
      setWorkValues(Array.isArray(data.workValues) ? data.workValues : (data.workValues ? [data.workValues] : []));
      setTeamStyle(data.teamStyle || "");
      setWorkEnvironment(data.workEnvironment || "");
      setMotivation(data.motivation || "");
    }
  }, []);

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill));
  }

  async function handleUpdate() {
    if (!applicant || !name || skills.length === 0 || !location) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen: Name, Skills und Standort.");
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
          bio, 
          industry,
          workValues,
          teamStyle,
          workEnvironment,
          motivation
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
                  {['Berlin','München','Hamburg','Kassel','Kassel Umgebung','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(city => (
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
                  {[...Array(51)].map((_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? "Keine Erfahrung" : i === 1 ? "1 Jahr" : `${i} Jahre`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ds-label">Höchster Abschluss</label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="ds-input ds-input-focus-blue"
                >
                  <option value="">Abschluss wählen (optional)</option>
                  {availableEducation.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
            </div>

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
              <label className="ds-label">Skills * (mindestens 1)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-[var(--border-radius-input)] p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      className={`text-sm px-3 py-2 rounded-[var(--border-radius-input)] border transition-all duration-300 ${
                        skills.includes(skill) 
                          ? 'ds-skill-tag-blue' 
                          : 'ds-skill-tag-default'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              {skills.length > 0 && (
                <div>
                  <p className="text-sm ds-body-light mb-2">Ausgewählte Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-2 ds-skill-tag-blue">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="hover:text-[var(--accent-blue-dark)] transition-colors duration-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Soft Factors Section */}
            <div className="border-t-2 border-purple-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🤝</span> Arbeitskultur & Werte
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Diese Angaben helfen uns, Jobs zu finden, die kulturell zu dir passen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Values */}
                <div>
                  <label className="ds-label">Was ist dir wichtig? (1-2 Werte)</label>
                  <div className="space-y-2">
                    {[
                      { id: "security", label: "🛡️ Sicherheit & Stabilität" },
                      { id: "fun", label: "🎉 Spaß & Atmosphäre" },
                      { id: "development", label: "📈 Entwicklung & Lernen" },
                      { id: "purpose", label: "🌍 Sinn & Beitrag" }
                    ].map(option => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={workValues.includes(option.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (workValues.length < 2) {
                                setWorkValues([...workValues, option.id]);
                              }
                            } else {
                              setWorkValues(workValues.filter(v => v !== option.id));
                            }
                          }}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team Style */}
                <div>
                  <label className="ds-label">Teamarbeit</label>
                  <select
                    value={teamStyle}
                    onChange={(e) => setTeamStyle(e.target.value)}
                    className="ds-input ds-input-focus-blue"
                  >
                    <option value="">Wählen...</option>
                    <option value="close">👥 Eng im Team</option>
                    <option value="balanced">🤝 Ausgewogen</option>
                    <option value="independent">🎯 Eigenständig</option>
                  </select>
                </div>

                {/* Work Environment */}
                <div>
                  <label className="ds-label">Arbeitsumfeld</label>
                  <select
                    value={workEnvironment}
                    onChange={(e) => setWorkEnvironment(e.target.value)}
                    className="ds-input ds-input-focus-blue"
                  >
                    <option value="">Wählen...</option>
                    <option value="quiet">🤫 Ruhig & konzentriert</option>
                    <option value="lively">💬 Lebendig & kommunikativ</option>
                    <option value="structured">📋 Strukturiert & organisiert</option>
                  </select>
                </div>

                {/* Motivation */}
                <div>
                  <label className="ds-label">Motivation</label>
                  <select
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="ds-input ds-input-focus-blue"
                  >
                    <option value="">Wählen...</option>
                    <option value="recognition">🏆 Anerkennung</option>
                    <option value="responsibility">🎯 Verantwortung</option>
                    <option value="success">📊 Erfolg</option>
                    <option value="learning">💡 Lernen & Innovation</option>
                  </select>
                </div>
              </div>
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
