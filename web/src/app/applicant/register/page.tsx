"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantRegister() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const availableSkills = [
    "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C#", "PHP",
    "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "Design", "Marketing",
    "Sales", "Management", "Communication", "Problem Solving", "Leadership"
  ];

  const availableIndustries = [
    "IT & Software", "Finanzwesen", "Gesundheitswesen", "Bildung", "E-Commerce", "Marketing & Werbung",
    "Beratung", "Ingenieurwesen", "Medien & Entertainment", "Immobilien", "Automotive", "Telekommunikation",
    "Energie", "Logistik", "Einzelhandel", "Gastronomie", "Recht", "Non-Profit", "Sonstiges"
  ];

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill));
  }

  async function handleRegister() {
    if (!email || !name || skills.length === 0 || !location) {
      alert("Bitte alle Pflichtfelder ausfüllen: E-Mail, Name, Skills und Standort.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, skills, location, experience: Number(experience) || 0, bio, industry }),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }
      
      const applicant = await res.json();
      localStorage.setItem("applicantSession", JSON.stringify(applicant));
      router.push("/applicant");
    } catch (error) {
      console.error("Register error:", error);
      alert(`Fehler bei der Registrierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center mb-8">
          <Link href="/applicant/choose" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrieren</h1>
          <p className="text-gray-600">Neues Bewerberkonto erstellen</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ihre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bevorzugte Branche</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills auswählen *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                      skills.includes(skill) 
                        ? 'bg-blue-100 border-blue-300 text-blue-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">Ausgewählt: {skills.join(", ")}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kurze Bio</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Erzählen Sie etwas über sich..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Registrieren..." : "Registrieren"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Bereits ein Konto?{" "}
                <Link href="/applicant/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Anmelden
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
