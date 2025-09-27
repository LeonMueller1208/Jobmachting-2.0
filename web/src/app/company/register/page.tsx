"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CompanyRegister() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const availableIndustries = [
    "IT & Software", "Finanzwesen", "Gesundheitswesen", "Bildung", "E-Commerce", 
    "Beratung", "Marketing", "Ingenieurwesen", "Vertrieb", "Sonstiges"
  ];

  async function handleRegister() {
    if (!email || !name || !industry || !location) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, industry, location }),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }
      
      const company = await res.json();
      localStorage.setItem("companySession", JSON.stringify(company));
      router.push("/company");
    } catch (error) {
      console.error("Register error:", error);
      alert(`Fehler bei der Registrierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Registrierung" showBackButton={true} backHref="/company/choose" />
      <main className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
        <div className="text-center mb-8">
          <Link href="/company/choose" className="inline-flex items-center ds-link-green mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
          </Link>
          <h1 className="text-3xl lg:text-4xl ds-heading mb-3">Registrieren</h1>
          <p className="text-base lg:text-lg font-light ds-body">Neues Firmenkonto erstellen</p>
        </div>

        <div className="ds-card p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ds-label mb-2">E-Mail *</label>
                <input
                  type="email"
                  className="ds-input ds-input-focus-green"
                  placeholder="firma@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="ds-label mb-2">Firmenname *</label>
                <input
                  type="text"
                  className="ds-input ds-input-focus-green"
                  placeholder="Ihr Firmenname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ds-label mb-2">Branche *</label>
                <select
                  className="ds-input ds-input-focus-green"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Branche wählen</option>
                  {availableIndustries.map(ind => 
                    <option key={ind} value={ind}>{ind}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="ds-label mb-2">Standort *</label>
                <select
                  className="ds-input ds-input-focus-green"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Standort wählen</option>
                  {['Berlin','München','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Remote'].map(c => 
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full ds-button-primary-green"
            >
              {loading ? "Registrieren..." : "Registrieren"}
            </button>

            <div className="text-center">
              <p className="ds-body-light">
                Bereits ein Konto?{" "}
                <Link href="/company/login" className="ds-link-green">
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

