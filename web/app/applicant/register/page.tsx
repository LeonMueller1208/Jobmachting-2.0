"use client";

import { useState } from "react";
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

export default function ApplicantRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [education, setEducation] = useState("");
  const [bio, setBio] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill));
  }

  async function handleSubmit() {
    if (!name || !email || skills.length === 0 || !location) {
      alert("Bitte alle Pflichtfelder ausfüllen: Name, E-Mail, Skills und Standort");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, skills, location, experience, education, bio, industry }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("applicantSession", JSON.stringify(data));
        alert("Profil erfolgreich erstellt!");
        router.push("/applicant");
      } else {
        const error = await res.json();
        alert(`Fehler: ${error.error || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Fehler bei der Registrierung");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Bewerber Registrierung" showBackButton={true} backHref="/applicant/choose" />
      
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-blue rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2">Registrierung</h1>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Erstellen Sie Ihr Bewerberprofil</p>
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
                <label className="ds-label">E-Mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ds-input ds-input-focus-blue"
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Standort *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="ds-input ds-input-focus-blue"
                >
                  <option value="">Standort wählen</option>
                  {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onClick={handleSubmit}
              disabled={loading}
              className="w-full ds-button-primary-blue"
            >
              {loading ? "Erstelle Profil..." : "Profil erstellen"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Bereits registriert?{" "}
              <a href="/applicant/login" className="ds-link-blue">
                Hier anmelden
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
