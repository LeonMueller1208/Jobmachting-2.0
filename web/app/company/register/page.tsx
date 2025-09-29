"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const availableIndustries = [
  "IT & Software", "Finanzwesen", "Gesundheitswesen", "E-Commerce", "Automotive", 
  "Medien & Marketing", "Bildung", "Logistik", "Energie", "Immobilien", "Sonstige"
];

export default function CompanyRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!name || !email || !industry || !location) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, industry, location }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Company registration response:", data); // Debug log
        console.log("Saving company session:", data); // Debug log
        localStorage.setItem("companySession", JSON.stringify(data));
        alert("Unternehmen erfolgreich registriert!");
        router.push("/company");
      } else {
        const error = await res.json();
        console.log("Registration error response:", error); // Debug log
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
      <Header title="Unternehmen Registrierung" showBackButton={true} backHref="/company/choose" />
      
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl ds-heading mb-2">Unternehmen registrieren</h1>
            <p className="ds-body-light">Erstellen Sie Ihr Unternehmensprofil</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ds-label">Unternehmensname</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ds-input ds-input-focus-green"
                  placeholder="Ihr Unternehmensname"
                />
              </div>
              <div>
                <label className="ds-label">E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ds-input ds-input-focus-green"
                  placeholder="kontakt@unternehmen.de"
                />
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
                  <option value="">Branche wählen</option>
                  {availableIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ds-label">Standort</label>
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
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full ds-button-primary-green"
            >
              {loading ? "Registriere Unternehmen..." : "Unternehmen registrieren"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Bereits registriert?{" "}
              <a href="/company/login" className="ds-link-green">
                Hier anmelden
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
