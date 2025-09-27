"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center mb-8">
          <Link href="/company/choose" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrieren</h1>
          <p className="text-gray-600">Neues Firmenkonto erstellen</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="firma@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firmenname *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ihr Firmenname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branche *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Standort *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Registrieren..." : "Registrieren"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Bereits ein Konto?{" "}
                <Link href="/company/login" className="text-green-600 hover:text-green-700 font-medium">
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

