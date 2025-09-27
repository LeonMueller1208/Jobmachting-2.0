"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type Applicant = { 
  id: string; 
  name: string; 
  email: string; 
  skills: string[]; 
  location: string; 
  experience: number; 
  bio?: string | null;
  industry?: string | null;
};

export default function EditApplicantProfile() {
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
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
    const stored = localStorage.getItem("applicantSession");
    if (stored) {
      try {
        const applicantData = JSON.parse(stored);
        setApplicant(applicantData);
        setName(applicantData.name);
        setSkills(applicantData.skills || []);
        setLocation(applicantData.location);
        setExperience(applicantData.experience);
        setBio(applicantData.bio || "");
        setIndustry(applicantData.industry || "");
      } catch (error) {
        console.error("Error parsing applicant session:", error);
        router.push("/applicant");
      }
    } else {
      router.push("/applicant");
    }
  }, [router]);

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
      alert("Bitte alle Pflichtfelder ausfüllen");
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
          experience: Number(experience), 
          bio, 
          industry 
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
      alert(`Fehler beim Aktualisieren: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  if (!applicant) {
    return (
      <div className="min-h-screen ds-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl ds-heading mb-4">Lade Profil...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Profil bearbeiten" showBackButton={true} backHref="/applicant" />
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

      <main className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
        <div className="text-center mb-8">
          <Link href="/applicant" className="inline-flex items-center ds-link-blue mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zum Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl ds-heading mb-3">Profil bearbeiten</h1>
          <p className="text-base lg:text-lg font-light ds-body">Aktualisieren Sie Ihre Bewerberinformationen</p>
        </div>

        <div className="ds-card p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ds-label mb-2">Name *</label>
                <input
                  type="text"
                  className="ds-input ds-input-focus-blue"
                  placeholder="Ihr Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="ds-label mb-2">E-Mail</label>
                <input
                  type="email"
                  className="ds-input bg-gray-100 cursor-not-allowed"
                  value={applicant.email}
                  disabled
                />
                <p className="text-xs ds-body-light mt-1">E-Mail kann nicht geändert werden</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ds-label mb-2">Standort *</label>
                <select
                  className="ds-input ds-input-focus-blue"
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
                <label className="ds-label mb-2">Berufserfahrung</label>
                <select
                  className="ds-input ds-input-focus-blue"
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
              <label className="ds-label mb-2">Bevorzugte Branche</label>
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

            <div>
              <label className="ds-label mb-2">Skills auswählen *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    className={`ds-skill-tag ${
                      skills.includes(skill) 
                        ? 'ds-skill-tag-blue' 
                        : 'ds-skill-tag-default'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="ds-body-light text-sm mt-2">Ausgewählt: {skills.join(", ")}</p>
              )}
            </div>

            <div>
              <label className="ds-label mb-2">Kurze Bio</label>
              <textarea
                className="ds-input ds-input-focus-blue"
                placeholder="Erzählen Sie etwas über sich..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 ds-button-primary-blue"
              >
                {loading ? "Aktualisiere..." : "Profil aktualisieren"}
              </button>
              <Link 
                href="/applicant"
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
